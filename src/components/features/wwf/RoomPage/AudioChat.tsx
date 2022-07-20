import Avatar from "@/components/shared/Avatar";
import { useRoomInfo } from "@/contexts/RoomContext";
import { BasicRoomUser, Room } from "@/types";
import { useTranslation } from "next-i18next";
import { MediaConnection } from "peerjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdOutlineHeadphones, MdOutlineKeyboardVoice } from "react-icons/md";
import { useQueryClient } from "react-query";
import IconWithMuted from "./IconWithMuted";

type CommunicateEvent = {
  type: "mic" | "headphone";
  isMicMuted?: boolean;
  isHeadphoneMuted?: boolean;
};

const AudioChat = () => {
  const { room, basicRoomUser, peer, socket } = useRoomInfo();
  const { t } = useTranslation("wwf");
  const connRefs = useRef<Record<string, MediaConnection>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const communicateUpdateTimeout = useRef<NodeJS.Timeout>();
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [isAudioStreamError, setIsAudioStreamError] = useState<boolean>();
  const queryClient = useQueryClient();

  const meRoomUser = useMemo(() => {
    return room.users.find(
      (roomUser) => roomUser?.userId === basicRoomUser.userId
    );
  }, [basicRoomUser.userId, room.users]);

  const isMicMuted = useMemo(
    () => meRoomUser?.isMicMuted ?? true,
    [meRoomUser?.isMicMuted]
  );
  const isHeadphoneMuted = useMemo(
    () => meRoomUser?.isHeadphoneMuted ?? false,
    [meRoomUser?.isHeadphoneMuted]
  );

  const handleToggleCommunicate = (event: CommunicateEvent) => () => {
    socket.emit("communicateToggle", {
      isMicMuted,
      isHeadphoneMuted,
      ...event,
    });
  };

  useEffect(() => {
    // https://codepen.io/forgived/pen/ZEQrWeW?editors=1111
    const handleMicLevel = async (userId: string, stream: MediaStream) => {
      let indicatorTimeout: NodeJS.Timeout = null;

      const handleIndicator = (isTalking: boolean) => {
        const avatar = document.querySelector(
          `.voice_chat--avatar[data-user-id="${userId}"]`
        );

        if (!avatar) return;

        if (isTalking) {
          avatar.classList.add("ring-4", "ring-green-700");

          if (indicatorTimeout) {
            clearTimeout(indicatorTimeout);

            indicatorTimeout = null;
          }
        } else {
          if (indicatorTimeout) return;

          indicatorTimeout = setTimeout(() => {
            avatar.classList.remove("ring-4", "ring-green-700");
          }, 500);
        }
      };

      const audioContext = new AudioContext();

      await audioContext.audioWorklet.addModule("/vumeter-processor.js");

      const microphone = audioContext.createMediaStreamSource(stream);

      const node = new AudioWorkletNode(audioContext, "vumeter");

      node.port.onmessage = (event) => {
        let _volume = 0;

        if (event.data.volume) _volume = event.data.volume;

        const MIC_LEVEL = _volume * 100;

        handleIndicator(MIC_LEVEL > 1);
      };

      microphone.connect(node).connect(audioContext.destination);
    };

    const handleAddAudioStream = (userId: string, stream: MediaStream) => {
      const audio = document.createElement("audio");

      const isMe = userId === basicRoomUser.userId;

      audio.srcObject = stream;

      audio.onloadedmetadata = () => {
        audio.play();
      };

      audio.muted = isMe;
      audio.setAttribute("data-user-id", userId);

      containerRef.current.append(audio);

      handleMicLevel(userId, stream);
    };

    const handlePeer = async () => {
      if (!room?.users?.length) return;

      if (!peer) {
        setIsAudioStreamError(true);

        return;
      }

      setIsAudioStreamError(false);

      let stream: MediaStream = audioStream;

      if (!stream) {
        const newStream = await navigator.mediaDevices
          .getUserMedia({
            audio: true,
          })
          .catch(() => {
            setIsAudioStreamError(true);
          });

        if (!newStream) return;

        stream = newStream;

        setAudioStream(stream);
      }

      if (!initialized.current) {
        // Self-stream for audio indicator
        handleAddAudioStream(basicRoomUser.userId, stream);

        peer.on("call", (call) => {
          const userId: string = call.metadata.userId;

          call.answer(stream);

          call.on("stream", (userVideoStream) => {
            handleAddAudioStream(userId, userVideoStream);
          });
        });

        initialized.current = true;
      }

      room.users.forEach((roomUser) => {
        if (roomUser.userId in connRefs.current) return;
        if (roomUser.userId === basicRoomUser.userId) return;

        const call = peer.call(roomUser.peerId, stream, {
          metadata: {
            userId: basicRoomUser.userId,
          },
        });

        call.on("stream", (stream) => {
          handleAddAudioStream(roomUser.userId, stream);
        });

        connRefs.current[roomUser.userId] = call;
      });
    };

    handlePeer();
  }, [audioStream, basicRoomUser.userId, isHeadphoneMuted, peer, room.users]);

  useEffect(() => {
    if (!socket) return;

    const handleCommunicateToggle = ({
      event,
      user,
    }: {
      event: CommunicateEvent;
      user: BasicRoomUser;
    }) => {
      queryClient.setQueryData<Room>(["room", room.id], (room) => {
        const roomUser = room.users.find(
          (roomUser) => roomUser.userId === user.userId
        );

        if (!roomUser) return room;

        const isHeadphoneMuted = roomUser.isHeadphoneMuted ?? false;
        const isMicMuted = roomUser.isMicMuted ?? true;

        // headphone muted -> headphone and mic muted
        // headphone unmuted -> headphone unmuted and mic uumuted
        // mic muted -> mic muted
        // mic unmuted -> mic unmuted and headphone unmuted

        let updatedMicMuted = isMicMuted;
        let updatedHeadphoneMuted = isHeadphoneMuted;

        if (!isHeadphoneMuted && !isMicMuted) {
          if (event.type === "mic") {
            updatedMicMuted = true;
            updatedHeadphoneMuted = false;
          } else {
            updatedMicMuted = true;
            updatedHeadphoneMuted = true;
          }
        } else if (isMicMuted && !isHeadphoneMuted) {
          if (event.type === "mic") {
            updatedMicMuted = false;
            updatedHeadphoneMuted = false;
          } else {
            updatedMicMuted = true;
            updatedHeadphoneMuted = true;
          }
        } else {
          updatedMicMuted = false;
          updatedHeadphoneMuted = false;
        }

        roomUser.isMicMuted = updatedMicMuted;
        roomUser.isHeadphoneMuted = updatedHeadphoneMuted;

        if (communicateUpdateTimeout.current) {
          clearTimeout(communicateUpdateTimeout.current);
        }

        // Debounce just in case multiple events are fired at the same time
        communicateUpdateTimeout.current = setTimeout(() => {
          socket.emit("communicateUpdate", {
            isMicMuted: updatedMicMuted,
            isHeadphoneMuted: updatedHeadphoneMuted,
          });
        }, 1000);

        return room;
      });
    };

    socket.on("communicateToggle", handleCommunicateToggle);

    return () => {
      socket.off("communicateToggle", handleCommunicateToggle);
    };
  }, [queryClient, room.id, socket]);

  useEffect(() => {
    const audios = containerRef.current.childNodes;

    audios.forEach((audio) => {
      if (!(audio instanceof HTMLAudioElement)) return;

      if (audio.dataset.userId === basicRoomUser.userId) return;

      audio.muted = isHeadphoneMuted;
    });
  }, [basicRoomUser.userId, isHeadphoneMuted]);

  useEffect(() => {
    if (!audioStream) return;

    const audioTrack = audioStream.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !isMicMuted;
  }, [isMicMuted, audioStream]);

  return (
    <div className="relative flex flex-col h-full">
      <div className="grow space-y-4 overflow-y-auto no-scrollbar">
        {room.users.map((roomUser) => {
          const userId = roomUser.userId;
          const isHeadphoneMuted = roomUser.isHeadphoneMuted ?? false;
          const isMicMuted = roomUser.isMicMuted ?? true;

          return (
            <div className="user" key={userId}>
              <div className="mx-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="voice_chat--avatar"
                    data-user-id={userId}
                    src={roomUser?.avatarUrl}
                  />

                  <p>{roomUser?.name || t("guest")}</p>
                </div>

                <div className="flex items-center gap-1">
                  {isMicMuted && (
                    <IconWithMuted
                      isMuted
                      Icon={MdOutlineKeyboardVoice}
                      secondary
                    />
                  )}

                  {isHeadphoneMuted && (
                    <IconWithMuted
                      isMuted
                      Icon={MdOutlineHeadphones}
                      secondary
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAudioStreamError ? (
        <p className="bg-background-800 p-2 text-semibold text-lg mb-2 text-primary-300">
          Không thể kết nối, vui lòng cho phép quyền truy cập microphone và thử
          lại
        </p>
      ) : !audioStream ? (
        <p className="bg-background-800 p-2 text-semibold text-lg mb-2 text-green-500">
          Đang kết nối...
        </p>
      ) : null}

      <div className="px-2 flex items-center justify-between">
        <div className="flex gap-2 items-center grow-0">
          <Avatar src={meRoomUser?.avatarUrl} />

          <p>{meRoomUser?.name || t("guest")}</p>
        </div>

        <div className="flex gap-1">
          <IconWithMuted
            onClick={handleToggleCommunicate({
              type: "mic",
              isMicMuted: !isMicMuted,
            })}
            isMuted={isMicMuted}
            Icon={MdOutlineKeyboardVoice}
            secondary
          />
          <IconWithMuted
            onClick={handleToggleCommunicate({
              type: "headphone",
              isHeadphoneMuted: !isHeadphoneMuted,
            })}
            isMuted={isHeadphoneMuted}
            Icon={MdOutlineHeadphones}
            secondary
          />
        </div>
      </div>

      <div ref={containerRef} className="audio-container"></div>
    </div>
  );
};

export default AudioChat;
