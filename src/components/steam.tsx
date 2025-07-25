import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToastAlert } from "@/hooks/useToastAlert";
import { ToastAlerts } from "./toastalerts";

import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";

const RE_VANITY = /^[a-zA-Z0-9_]+$/;
const RE_STEAMID = /^\d+$/;
const RE_STEAMURL = /^https?:\/\/steamcommunity\.com\/(id|profiles)\/[a-zA-Z0-9_]+\/?$/;

type SteamType = {
    type: string
    value: string
};

const getSteam = ( value: string ): SteamType | null => {
    if (RE_STEAMURL.test(value)) {
        const url = new URL(value)

        const parts = url.pathname.split("/").filter(Boolean);
        const type = parts[0];
        const val = parts[1];

        if (type === "id") return { type: "vanity", value: val };

        else if (type === "profiles") return { type: "id", value: val };
    }
    
    else if (RE_STEAMID.test(value)) {
        return { type: "id", value: value };
    }

    else if (RE_VANITY.test(value)) {
        return { type: "vanity", value: value };
    }

    return null;
}

const getSteamID = async ( value: string ): Promise<string | null> => {
    const steam = getSteam(value);

    if (!steam) return null;

    const response = await axios.get("https://achguide.vicexe.ovh/getsteamaccount", {
        params: {
            type: steam.type,
            value: steam.value
        },
        validateStatus: () => true
    });

    if (response.status !== 200) return null;

    const data = response.data.response;

    switch (steam.type) {
        case "id":
            if (data.players.length === 0) return null

            return data.players[0].steamid;

        case "vanity":
            if (data.success !== 1) return null;

            return data.steamid;
    }

    return null;
}

export const Steam = () => {
    const { toasts, showSuccess, showError } = useToastAlert();
    const [ profile, setProfile ] = useState("");
    const [ editing, setEditing ] = useState("");
    
    const steamid = sessionStorage.getItem("steamid");

    const location = useLocation();
    const currentPath = location.pathname + location.search
    const steamLoginUrl = "https://achguide.vicexe.ovh/steam/auth?returnto=" + encodeURIComponent(currentPath)

    const saveProfile = async () => {
        if (!editing) {
            sessionStorage.removeItem("steamid");

            showSuccess("Success!", "Steam ID was successfully removed.");

            setProfile("");
            setEditing("");

            return;
        }

        const steamid = await getSteamID(editing);

        if (!steamid) {
            showError("Failed.", "This user does not exist.");
            return;
        }

        setProfile(editing);
        showSuccess("Success!", "Steam ID was successfully set. You can refresh the page now.");

        sessionStorage.setItem("steamid", steamid);
    }

    const cancel = () => {
        setEditing(profile);
    }

    useEffect(() => {
        if (steamid) {
            setProfile(steamid);
            setEditing(steamid);
        }
    }, [steamid]);

    return (
        <>
            <Dialog>
                <DialogTrigger className="mx-4 cursor-pointer transition-transform duration-200 hover:scale-95 flex items-center justify-center md:gap-3">
                    <svg width="32" height="32" viewBox="0 0 256 259" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M127.779 0C60.42 0 5.24 52.412 0 119.014l68.724 28.674a35.812 35.812 0 0 1 20.426-6.366c.682 0 1.356.019 2.02.056l30.566-44.71v-.626c0-26.903 21.69-48.796 48.353-48.796 26.662 0 48.352 21.893 48.352 48.796 0 26.902-21.69 48.804-48.352 48.804-.37 0-.73-.009-1.098-.018l-43.593 31.377c.028.582.046 1.163.046 1.735 0 20.204-16.283 36.636-36.294 36.636-17.566 0-32.263-12.658-35.584-29.412L4.41 164.654c15.223 54.313 64.673 94.132 123.369 94.132 70.818 0 128.221-57.938 128.221-129.393C256 57.93 198.597 0 127.779 0zM80.352 196.332l-15.749-6.568c2.787 5.867 7.621 10.775 14.033 13.47 13.857 5.83 29.836-.803 35.612-14.799a27.555 27.555 0 0 0 .046-21.035c-2.768-6.79-7.999-12.086-14.706-14.909-6.67-2.795-13.811-2.694-20.085-.304l16.275 6.79c10.222 4.3 15.056 16.145 10.794 26.46-4.253 10.314-15.998 15.195-26.22 10.895zm121.957-100.29c0-17.925-14.457-32.52-32.217-32.52-17.769 0-32.226 14.595-32.226 32.52 0 17.926 14.457 32.512 32.226 32.512 17.76 0 32.217-14.586 32.217-32.512zm-56.37-.055c0-13.488 10.84-24.42 24.2-24.42 13.368 0 24.208 10.932 24.208 24.42 0 13.488-10.84 24.421-24.209 24.421-13.359 0-24.2-10.933-24.2-24.42z" fill="currentColor"/></svg>
                    <span className="hidden md:inline text-[14px] whitespace-nowrap">Connect Steam</span>
                </DialogTrigger>
                <DialogContent className="rounded-[8px]">
                    <DialogHeader>
                        <DialogTitle>Auto achievment check</DialogTitle>
                        <DialogDescription>
                            Add your steam id to automatically check already obtained achievements.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center">
                        <button className="cursor-pointer" onClick={() => window.location.href = steamLoginUrl}><img src="/achievement-guide/steamlogin.png" alt="steam login image" /></button>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="steamid-1">Steam profile<span className="text-red-500">*</span></Label>
                        <Input className="rounded-[8px]" required={true} id="steamid-1" name="steamid" placeholder="vanity/id/profile url" onChange={(e) => {setEditing(e.target.value)}} value={editing} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={cancel} className="cursor-pointer rounded-[8px]">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" onClick={saveProfile} className="cursor-pointer rounded-[8px] transition-colors duration-200 hover:bg-green-500">Save changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ToastAlerts toasts={toasts}/>
        </>
    )
}