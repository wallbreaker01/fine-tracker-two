"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cloudinaryConfig, isCloudinaryConfigured } from "@/lib/cloudinary/client";
import { StoredUser, ProfileAvatarUploaderProps } from "@/lib/types";



export function ProfileAvatar({userId, name, initials, image} : ProfileAvatarUploaderProps){
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSelectFile =() =>{
        inputRef.current?.click();
    }

    const onUpload = async (event : React.ChangeEvent<HTMLInputElement>) =>{
        if(!isCloudinaryConfigured){
            setError("Functionality not configured yet.")
        }
        const file = event.target.files?.[0];
        if(!file) return;
        if(!file.type.startsWith("image/")){
            setError("Please select an image file.");
            return;
        }
        setError(null);
        setIsUploading(true);

        try{
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', cloudinaryConfig.uploadPreset)
            formData.append('folder', `fine-tracker/profile-pictures/${userId}`);
            
            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );
            const uploadData = (await uploadResponse.json()) as {
                secure_url?: string;
                error?: { message?: string };
            }
            if(!uploadData.secure_url || !uploadResponse.ok){
                throw new Error(uploadData.error?.message || "Failed to upload image to Cloudinary");
            }
            
            const avatarUrl = uploadData.secure_url;
            const response = await fetch("/api/profile/avatar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarUrl }),
            });
            const data = (await response.json()) as {
                success: boolean;
                message?: string;
                data?: { avatar?: string | null };
            };
            if(!response.ok || !data.success){
                throw new Error(data.message || "Failed to save profile photo");
            }

            const rawUser = localStorage.getItem('fineTrackerUser');
            if(rawUser){
                try{
                    const storeUser = JSON.parse(rawUser) as StoredUser;
                    localStorage.setItem(
                        "fineTrackerUser",
                        JSON.stringify({
                            ...storeUser,
                            avatar: data.data?.avatar ?? avatarUrl,
                        }),
                    );
                    window.dispatchEvent(new CustomEvent("fineTrackerUserUpdated"));

                } catch(error){
                    localStorage.removeItem("fineTrackerUser");
                }
            }
            router.refresh(); 
        } catch(error){
            setError("Failed to upload image.");
        } finally{
            event.target.value = "";
            setIsUploading(false);
        }
    }
    return(
        <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24 wounded-full bg-muted shrink-0">
                <AvatarImage src={image?? ""} alt={name}/>
                <AvatarFallback className="text-2xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <Button type="button" onClick={onSelectFile} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Change Photo'}
            </Button>
            <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
            disabled={isUploading}
            />
            {error ? <p className="text-xs text-center">{error}</p> : null}
        </div>
    )

}