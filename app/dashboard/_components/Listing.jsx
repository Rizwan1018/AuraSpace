"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import EmptyState from './EmptyState';
import Link from 'next/link';
import { db } from '@/config/db';
import { AiGeneratedImage } from '@/config/schema';
import { desc, eq } from 'drizzle-orm';
import RoomDesignCard from './RoomDesignCard';
import AiOutputDialog from './AiOutputDialog';

function Listing() {
    const { user } = useUser();
    const [userRoomList, setUserRoomList] = useState([]);
    const [openDialog,setOpenDialog]=useState(false);
    const [selectedRoom,setSelectedRoom]=useState()
    useEffect(()=>{
        user&&GetUserRoomList();
    },[user])

    const GetUserRoomList=async()=>{
        const result=await db.select().from(AiGeneratedImage)
        .where(eq(AiGeneratedImage.userEmail,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc( AiGeneratedImage.id))
        
        setUserRoomList(result);
        console.log(result);
    }
    return (
        <div>
            <div className='flex items-center justify-between'>
                <h2 className='font-bold text-3xl'>Hello, {user?.fullName}</h2>
                <Link href={'/dashboard/create-new'}>
                    <Button>+ Redesign Room</Button>
                </Link>
            </div>


            {userRoomList?.length == 0 ?
                <EmptyState />
                :
                <div className='mt-10'>
                    <h2 className='font-medium text-primary text-xl mb-10'>AI Room Studio</h2>
                    {/* Listing  */}
                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                        {userRoomList.map((room,index)=>(
                            <div onClick={()=>{setOpenDialog(true);setSelectedRoom(room)}}>
                            <RoomDesignCard key={index} room={room}/>
                            </div>
                        ))}
                        
                    </div>
                </div>
            }
 <AiOutputDialog aiImage={selectedRoom?.aiImage} orgImage={selectedRoom?.orgImage}
        closeDialog={()=>setOpenDialog(false)}
        openDialog={openDialog}
        />
        </div>
    )
}

export default Listing