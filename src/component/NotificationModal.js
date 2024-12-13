import "./css/NotificationBox.css";
import { useEffect, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import axios from "axios";

export default function NotificationModal({ onClose }) {
    const [notifications, setNotications] = useState([]);
    const [users, setUsers] = useState([]);
    const accessToken = sessionStorage.getItem('accessToken');
    const id = sessionStorage.getItem('id');
    const [currentNickname, setCurrentNickname] = useState('');
    const [welcomeTime, setWelcomeTime] = useState(''); 

    const formatDatetime = (t) => {
        const date = new Date(t);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false }; // 24시간 형식 사용
        return date.toLocaleTimeString('ko-KR', options);
    };

    useEffect(() => {
        const savedLastEventId = localStorage.getItem("lastEventId");
        const loggedInUserId = localStorage.getItem("userId");
        const defaultProfile = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
        const eventSource = new EventSourcePolyfill(
            `http://localhost:9292/kafkaListener/subscribe/${loggedInUserId}`,
            {
                headers: {
                    "Last-Event-ID": savedLastEventId, // 저장된 lastEventId 값 사용
                },
                heartbeatTimeout: 3600000,

            }
        );

        eventSource.onopen = async () => {
            // await console.log("sse opened!");
        };

        eventSource.addEventListener("notification", (e) => {
            let res = JSON.parse(e.data);
            // console.log(res);

            res.eventCreatedTime = formatDatetime(res.eventCreatedTime);


            //
            const resArray = Array.isArray(res) ? res : [res];

            setNotications((notifications) => [...notifications, ...resArray]);
            // console.log(notifications);
            // console.log(e.lastEventId);




            localStorage.setItem("lastEventId", e.lastEventId);
        });


        // if unmounted. -> 조건부렌더out, page아웃
        return () => {
            eventSource.close();

        };
    }, []);

    //close when click arised outside
    useEffect(() => {
        const handleMouseUpOutside = (e) => {
            const targetEventListener = document.querySelector(".notification-modal")
            if (targetEventListener && !targetEventListener.contains(e.target)) {
                onClose();
            }
        }

        // add certaineventMapper
        document.addEventListener('mouseup', handleMouseUpOutside);

    }, []);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // 예: 2024년 4월 27일
        return date.toLocaleDateString('ko-KR', options);
    };

    // 사용자 데이터 가져오기
    useEffect(() => {
        if (accessToken) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/master`, {
                headers: {
                    Authorization: `${accessToken}`
                }
            })
                .then(response => {
                    // console.log(response.data);
                    if (response.data) {
                        setUsers(response.data);
                        // 현재 사용자의 nickname 찾기
                        const currentUser = response.data.find(user => String(user.id) === String(id));
                        if (currentUser) {
                            setCurrentNickname(currentUser.nickname);
                            // 로그인 시점의 날짜를 포맷하여 welcomeTime 상태에 설정
                            setWelcomeTime(formatDate(new Date()));
                        }
                    }
                })
                .catch(error => {
                    // console.log("데이터를 가져오는 중 오류가 발생했습니다.", error);
                });
        }
    }, [accessToken, id]);

    return (
        <>
            <div className="notification-modal">
                
                <div class="noti-panel">
                    <div class="noti-header">
                        <span class="noti-title">Notifications</span>
                    </div>

                    <div class="notifications clearfix">
                        <div class="noti-line"></div>
                        <div class="notification">
                            <div class="noti-circle"></div>
                            <span class="noti-time">{welcomeTime}</span>
                            <p class="noti-p"><b class="noti-b">{currentNickname}님</b> 숏폼 광고 의류 이커머스 Shotpingoo에 오신 것을 환영합니다.🥰</p>
                        </div>
                        {/* <div class="notification">
                            <div class="noti-circle"></div>
                            <span class="noti-time">8:19 AM</span>
                            <p class="noti-p"><b class="noti-b">Alice Parker</b> commented your last post.</p>
                        </div>
                        <div class="notification">
                            <div class="noti-circle"></div>
                            <span class="noti-time">Yesterday</span>
                            <p class="noti-p"><b class="noti-b">Luke Wayne</b> added you as friend.</p>
                        </div> */}
                    </div>
                </div>





            </div>
        </>
    );
}