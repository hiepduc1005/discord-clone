"use client"


import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FileUploadProps{
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
    setFileName ?: (value?: any) => void;
}

export const FileUpload = ({
    onChange,
    value,
    endpoint,
    setFileName
}:FileUploadProps) => {

    const [fName,setFName] = useState("")

    const fileType = fName?.split('.').pop();

    if(value && fileType !== "pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image
                   fill
                   src={value}
                   alt="Upload"
                   className="rounded-full"
                >

                </Image>
                <button
                    onClick={() => onChange('')}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4"></X>
                </button>
            </div>
        )
    }

    if(value && fileType === "pdf"){
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon 
                    className="h-10 w-10 fill-indigo-200 stroke-indigo-400"
                />
                <a 
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline flex-wrap break-all"
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange('')}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4"></X>
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res)=> {
                setFName(res?.[0].name)
                onChange(res?.[0].url)
                if (setFileName) {
                    setFileName(res?.[0].name);
                }
            }}

            onUploadError={(error) => {
                console.log(error)
            }}

            onUploadBegin={(name) => {
                // Do something once upload begins
                console.log("Uploading: ", name);
            }}
            
        />

    )
}