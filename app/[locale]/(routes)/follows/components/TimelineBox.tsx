"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Story {
    id: string;
    content: string;
    createdAt: string;
    expiresAt: string;
    media: { id: string; url: string; storyId: string }[];
}

const Timeline = () => {
    const { data: session } = useSession();
    const accessToken = session?.user?.accessToken;
    const userId = session?.user?.id;
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        const fetchInitialStories = async () => {
            try {
                const response = await axios.post('http://localhost:8002/api/v1/story/followed', { userId }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setStories(response.data.data);
            } catch (error) {
                console.error('Error fetching initial stories:', error);
            }
        };

        if (accessToken && userId) {
            fetchInitialStories();

            const pusher = new Pusher('fa7992f1f03fd0f805c5', {
                cluster: 'ap1',
                forceTLS: true,
            });

            const channel = pusher.subscribe('ioh-websocket-stories-development');

            channel.bind('new-story', (data: Story) => {
                setStories((prevStories) => {
                    const isNewStory = !prevStories.some((story) => story.id === data.id);
                    if (isNewStory) {
                        return [data, ...prevStories];
                    }
                    return prevStories;
                });
            });

            channel.bind('pusher:subscription_succeeded', () => {
                console.log('Successfully subscribed to Pusher channel');
            });

            channel.bind('pusher:subscription_error', (status: any) => {
                console.error('Pusher subscription error:', status);
            });

            return () => {
                channel.unbind_all();
                channel.unsubscribe();
                pusher.disconnect();
            };
        }
    }, [accessToken, userId]);

    return (
        <div className="mx-auto w-2/3 px-10 py-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="my-6">
                {stories.length === 0 ? (
                    <p className="text-gray-600 text-center">No stories to display...</p>
                ) : (
                    stories.map((story) => (
                        <div key={story.id} className="story mb-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                            <p className="text-lg font-medium text-gray-900 mb-2">{story.content}</p>
                            <p className="text-sm text-gray-500">
                                Posted on {new Date(story.createdAt).toLocaleString()}
                            </p>
                            <div className="mt-4">
                                {story.media.length > 0 && (
                                    <div className="flex space-x-2">
                                        {story.media.map((mediaItem) => (
                                            <img
                                                key={mediaItem.id}
                                                src={mediaItem.url}
                                                alt="Story media"
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Timeline;
