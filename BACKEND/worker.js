/*
 * 
 *  NOTE: THIS IS A CLOUDFLARE WORKER'S CODE
 * 
 */

const RATE_LIMIT = new Map();
const REALM = "https://achguide.goldenowy23.workers.dev";
const STEAM_OPENID = "https://steamcommunity.com/openid/login";
const GHPAGE = "https://vicexe0.github.io/achievement-guide";

const getAllAchievements = async ( appid, key ) => {
    const params = new URLSearchParams({
        key: key,
        appid: appid
    });

    try {
        const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?${params}`);
        const data = await response.json();

        return data;

    } catch {
        return 500;
    }
}

const getPlayerAchievements = async ( appid, steamid, key ) => {
    const params = new URLSearchParams({
        key: key,
        steamid: steamid,
        appid: appid
    });

    try {
        const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?${params}`);
        const data = await response.json();

        return data;

    } catch {
        return 500;
    }
}

const merge = ( arr1, arr2 ) => {
    const merged = arr1.map(item1 => {
        const { apiname, ...rest } = arr2.find(item2 => item2.apiname == item1.name) || {};
        return {
        ...item1,
        ...rest
        }
    });

    return merged;
}

const getAchievements = async ( url, env ) => {
    const steamid = url.searchParams.get("steamid");
    const appid = url.searchParams.get("appid");
    
    if (!steamid || !appid) return [ 400, "Missing parameters." ];
    
    const KEY = env.STEAM_API_KEY;

    const allachievements = (await getAllAchievements(appid, KEY))?.game.availableGameStats.achievements;
    const userAchievements = (await getPlayerAchievements(appid, steamid, KEY))?.playerstats.achievements;

    if (!userAchievements) return [ 400, "This user doesnt own this game." ];
    if (!allachievements) return [ 404, "This game doesnt exist." ];

    if (userAchievements === 500 || allachievements === 500) return [ 500, "Steam API error." ];

    const data = merge(allachievements, userAchievements);

    return [ null, data ];
}

const getSteamAccount = async ( url, env ) => {
    const value = url.searchParams.get("value");
    const type = url.searchParams.get("type");

    if (!value || !type) return [ 400, "Missing parameters." ];

    const KEY = env.STEAM_API_KEY;

    let response, params;

    switch (type) {
        case "id":
            params = new URLSearchParams({
                key: KEY,
                steamids: value
            })
            response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?${params.toString()}`);

            break;

        case "vanity":
            params = new URLSearchParams({
                key: KEY,
                vanityurl: value
            })
            response = await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?${params.toString()}`);

            break;

        default:
            return [ 400, "Invalid type. Expected id/vanity" ];
    }

    const data = await response.json();

    return [ null, data ];
}

const loginToSteam = async ( url ) => {
    const returnTo = url.searchParams.get("returnto");

    if (!returnTo) return [ 400, "Missing parameters." ];

    const params = new URLSearchParams({
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": `${REALM}/steam/return?redirect=${encodeURIComponent(returnTo)}`,
        "openid.realm": REALM,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
    });

    return [ 302, `${STEAM_OPENID}?${params.toString()}` ];
}

const authUser = async ( url ) => {
    const searchParams = url.searchParams;
    const verifyParams = new URLSearchParams();
    
    for (const [ key, value ] of searchParams) {
        verifyParams.append(key, value);
    }

    verifyParams.set("openid.mode", "check_authentication");

    try {
        const response = await fetch(STEAM_OPENID, {
            method: "POST",
            body: verifyParams.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const text = await response.text();

        if (!text.includes("is_valid:true"))  return [ 400, "OpenID verification failed" ];

        const claimedID = searchParams.get("openid.claimed_id");
        const steamIDMatch = claimedID && claimedID.match(/\/id\/(\d+)$/) || claimedID.match(/\/openid\/id\/(\d+)$/);

        if (!steamIDMatch) return [ 400, "Failed to extract SteamID" ];

        const steamID = steamIDMatch[1];

        const redirectParam = encodeURIComponent(url.searchParams.get("redirect") || "");
        
        return [ 302, `${GHPAGE}/login-success?steamid=${steamID}&redirect=${redirectParam}` ];
    } catch {
        return [ 500, "Steam verification error" ];
    }
}

const isRateLimited = async ( ip ) => {
    const now = Date.now();
    const window = 60 * 1000;
    const limit = 30;

    const record = RATE_LIMIT.get(ip);

    if (!record || now - record.start > window) {
        RATE_LIMIT.set(ip, { count: 1, start: now });
        return false;
    }

    if (record.count >= limit) return true;

    record.count++;
    return false;
}

export default {
    async fetch(request, env, ctx) {
        const ip = request.headers.get("CF-Connecting-IP");

        if (await isRateLimited(ip)) {
            return new Response("Too many requests", { status: 429 });
        }

        const url = new URL(request.url);

        if (request.method === "GET") {
            const cache = caches.default;
            const cached = await cache.match(request);
            if (cached) return cached;
        }

        let error, data;

        switch (url.pathname) {
            case "/getsteamaccount":
                [ error, data ] = await getSteamAccount(url, env);
                break;

            case "/getachievements":
                [ error, data ] = await getAchievements(url, env);
                break;

            case "/steam/auth":
                [ error, data ] = await loginToSteam(url);

                break;

            case "/steam/return":
                [ error, data ] = await authUser(url);

                break;

            default:
                return new Response("Not found", { status: 404 });
        }

        if (error === 302) return Response.redirect(data, 302);

        if (error) return new Response(data, { status: error });

        const response = new Response(JSON.stringify(data), {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=300"
            }
        });

        if (request.method === "GET") {
            ctx.waitUntil(caches.default.put(request, response.clone()));
        }

        return response;
    }
}