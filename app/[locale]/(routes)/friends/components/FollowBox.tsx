"use client";

import { toast } from "react-hot-toast";
import { useCompletion } from "ai/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  imageUrl?: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: User[];
}

export default function FollowBox() {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;
  const userId = session?.user?.id;

  const { completion, handleInputChange, handleSubmit } = useCompletion({
    onFinish: () => {
      toast.success("Successfully generated completion!");
    },
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:9001/api/v1/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: ApiResponse = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [accessToken]);

  const parseUsername = (username: string) => {
    return username.split(/[@._]/)[0];
  };

  const followUser = async (followingId: string) => {
    if (!userId || !accessToken) return;

    try {
      const response = await fetch('http://localhost:8002/api/v1/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          followerId: userId,
          followingId: followingId,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      toast.success(`Successfully followed user ${followingId}`);
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Error following user');
    }
  };

  return (
    <div className="mx-auto w-full h-full p-6 flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-4xl h-[calc(100vh-200px)] px-4 py-6 overflow-y-auto bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500 text-xl">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300"
                  style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {!user.imageUrl && (
                    <span className="text-gray-500 text-xl">{parseUsername(user.username).charAt(0)}</span>
                  )}
                </div>
                <span className="mt-2 text-sm text-center">{parseUsername(user.username)}</span>
                <button
                  type="button"
                  className="mt-2 p-2 bg-blue-500 text-white rounded shadow-lg"
                  onClick={() => followUser(user.id)}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6">{completion}</div>
      </div>
    </div>
  );
}
