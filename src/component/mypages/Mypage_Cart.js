import { useState, useRef, useEffect } from "react";
import "../css/Mypage_Cart.css";
import test1 from "../../img/Nike.PNG";
import test2 from "../../img/product.jpg";
import test3 from "../../img/product-d.jpg";
import { BsPinAngleFill } from "react-icons/bs";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaTrashAlt } from 'react-icons/fa';

// 상품 가격 배열
const STOCK_PRICE = [
    { id: 1, name: "Item 1", price: 1000, image: test1 },
    { id: 2, name: "Item 2", price: 2000, image: test2 },
    { id: 3, name: "Item 3", price: 3000, image: test3 },
];

function Mypage_Cart() {
    const [targets, setTargets] = useState([]);
    const [savedTabs, setSavedTabs] = useState([]); // 저장된 탭
    const [activeTab, setActiveTab] = useState(null); // 클릭된 탭의 ID
    const targetBoxRef = useRef(null);
    const [box, setBox] = useState({ top: 0, left: 0, bottom: 0, right: 0 });
    const positionRef = useRef({});

    // 애니메이션을 위한 refs
    const circleRefs = useRef({});
    const circleLoaderRefs = useRef({});
    const tabRefs = useRef({});

    let posX = 0;
    let posY = 0;
    let originalX = 0;
    let originalY = 0;

    useEffect(() => {
        const updateBox = () => {
            const box = targetBoxRef.current.getBoundingClientRect();
            setBox({
                top: box.top,
                left: box.left,
                bottom: box.top + box.height,
                right: box.left + box.width,
            });
        };

        // 초기 렌더링 시 box 좌표 계산
        updateBox();

        // 창 크기 변경 시 box 좌표 업데이트
        window.addEventListener("resize", updateBox);

        return () => window.removeEventListener("resize", updateBox);
    }, []);

    // 애니메이션 핸들러
    const handleAnimation = (tabId) => {
        if (
            circleLoaderRefs.current[tabId] &&
            circleRefs.current[tabId] &&
            tabRefs.current[tabId]
        ) {
            circleLoaderRefs.current[tabId].classList.remove('animation');
            circleRefs.current[tabId].classList.remove('animation_circle');
            tabRefs.current[tabId].classList.remove('animation_card');

            setTimeout(() => {
                circleLoaderRefs.current[tabId].classList.add('animation');
                setTimeout(() => {
                    circleRefs.current[tabId].classList.add('animation_circle');
                    tabRefs.current[tabId].classList.add('animation_card');

                    // 애니메이션 완료 후 탭 삭제
                    setTimeout(() => {
                        setSavedTabs(prev => prev.filter(tab => tab.id !== tabId));
                        setActiveTab(null);
                        setTargets([]);
                    }, 1000);
                });
            }, 100);
        }
    };

    const dragStartHandler = (e) => {
        const img = new Image();
        e.dataTransfer.setDragImage(img, 0, 0);
        posX = e.clientX;
        posY = e.clientY;

        // 드래그 시작 시 요소 id 저장
        e.dataTransfer.setData("targetId", e.target.id || "");
    };

    const dragHandler = (e) => {
        e.target.style.left = `${e.clientX - posX}px`;
        e.target.style.top = `${e.clientY - posY}px`;

        // 마지막 좌표 저장
        positionRef.current[e.target.id] = {
            top: e.clientY - box.top,
            left: e.clientX - box.left,
        };
    };

    const dragEndHandler = (e) => {
        if (box.left < e.clientX && e.clientX < box.right && box.top < e.clientY && e.clientY < box.bottom) {
            setTargets((targets) => {
                const newTargets = [...targets];
                const targetId = parseInt(e.target.id);
                const details = STOCK_PRICE.find((item) => item.id === targetId);
                newTargets.push({
                    stamp_id: parseInt(e.timeStamp),
                    top: e.clientY - box.top,
                    left: e.clientX - box.left,
                    details: details,
                });
                return newTargets;
            });
        }
        e.target.style.left = "0px";
        e.target.style.top = "0px";
    };

    // const targetDragStartHandler = (e) => {
    //     const img = new Image();
    //     e.dataTransfer.setDragImage(img, 0, 0);
    //     e.dataTransfer.setData("targetId", e.target.id || "");
    //     posX = e.clientX - e.target.offsetLeft;
    //     posY = e.clientY - e.target.offsetTop;
    //     originalX = e.target.offsetLeft;
    //     originalY = e.target.offsetTop;
    // };

    // const targetDragStartHandler = (e, targetId) => {
    //     posX = e.clientX;
    //     posY = e.clientY;

    //     const handleMouseMove = (moveEvent) => {
    //         // 드래그가 종료된 위치에서 좌표 저장
    //         const dx = moveEvent.clientX - posX;
    //         const dy = moveEvent.clientY - posY;
    //         posX = moveEvent.clientX;
    //         posY = moveEvent.clientY;

    //         setTargets((targets) =>
    //             targets.map((target) =>
    //                 target.stamp_id === targetId
    //                     ? { ...target, top: target.top + dy, left: target.left + dx }
    //                     : target
    //             )
    //         );
    //     };

    //     // document에 이벤트 리스너를 붙이면 화면 어디에서든 해당 이벤트를 감지
    //     const handleMouseUp = () => {
    //         // 이벤트가 더 이상 발생하지 않도록 정리
    //         document.removeEventListener("mousemove", handleMouseMove);
    //         document.removeEventListener("mouseup", handleMouseUp);
    //     };

    //     // 특정 이벤트가 발생할 때 실행할 동작을 정의
    //     document.addEventListener("mousemove", handleMouseMove);
    //     document.addEventListener("mouseup", handleMouseUp);
    // };

    // const targetDragEndHandler = (e) => {
    //     const targetId = parseInt(e.dataTransfer.getData("targetId"));

    //     if (box.left < e.clientX && e.clientX < box.right && box.top < e.clientY && e.clientY < box.bottom) {
    //         setTargets((targets) => {
    //             const newTargets = targets.map((target) =>
    //                 target.stamp_id === targetId
    //                     ? { ...target, top: e.clientY - box.top, left: e.clientX - box.left }
    //                     : target
    //             );

    //             // positionRef에 최신 좌표 업데이트
    //             positionRef.current[targetId] = {
    //                 top: e.clientY - box.top,
    //                 left: e.clientX - box.left,
    //             };

    //             return newTargets;
    //         });
    //     } else {
    //         e.target.style.left = `${originalX}px`;
    //         e.target.style.top = `${originalY}px`;

    //         // positionRef에 원래 좌표로 복원
    //         positionRef.current[targetId] = {
    //             top: originalY,
    //             left: originalX,
    //         };
    //     }
    // };

    const targetDragStartHandler = (e, targetId) => {
        posX = e.clientX;
        posY = e.clientY;

        const handleMouseMove = (moveEvent) => {
            // 드래그 위치 업데이트
            const dx = moveEvent.clientX - posX;
            const dy = moveEvent.clientY - posY;
            posX = moveEvent.clientX;
            posY = moveEvent.clientY;

            setTargets((targets) =>
                targets.map((target) =>
                    target.stamp_id === targetId
                        ? { ...target, top: target.top + dy, left: target.left + dx }
                        : target
                )
            );
        };

        const handleMouseUp = (upEvent) => {
            // targetDragEndHandler를 호출하여 최종 위치 확인 및 복귀 처리
            targetDragEndHandler(upEvent, targetId);

            // 이벤트 리스너 제거
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        // 이벤트 리스너 추가
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const targetDragEndHandler = (e, targetId) => {
        const boxRect = targetBoxRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
        if (boxRect.left < e.clientX && 
            e.clientX < boxRect.right && 
            boxRect.top < e.clientY && 
            e.clientY < boxRect.bottom) {
            
            setTargets((targets) => {
                const newTargets = targets.map((target) =>
                    target.stamp_id === targetId
                        ? { 
                            ...target, 
                            top: e.clientY + scrollTop - boxRect.top,
                            left: e.clientX + scrollLeft - boxRect.left -10
                          }
                        : target
                );
    
                // positionRef 업데이트
                positionRef.current[targetId] = {
                    top: e.clientY + scrollTop - boxRect.top,
                    left: e.clientX + scrollLeft - boxRect.left-10
                };
    
                return newTargets;
            });
        } else {
            // target-box 외부에 놓였을 때 이전 위치로 복귀
            const previousPosition = positionRef.current[targetId];
            setTargets((targets) =>
                targets.map((target) =>
                    target.stamp_id === targetId
                        ? { ...target, top: previousPosition.top, left: previousPosition.left }
                        : target
                )
            );
        }
    };

    const deleteTarget = (stamp_id) => {
        setTargets((targets) => targets.filter((target) => target.stamp_id !== stamp_id));
    };

    const addTabToSecondBox = () => {
        const tabId = Date.now();
        const newTab = {
            id: tabId,
            name: `탭 ${savedTabs.length + 1}`,
            items: targets.map(target => ({
                tabId: tabId,
                stamp_id: target.stamp_id,
                top: positionRef.current[target.stamp_id]?.top || target.top,
                left: positionRef.current[target.stamp_id]?.left || target.left,
                details: target.details,
                // customName: `탭 ${savedTabs.length + 1}`
            }))
        };

        setSavedTabs([...savedTabs, newTab]);
        setTargets([]);
        console.log("newTab targets:", newTab.items);
        // console.log("Current targets:", targets);
    };

    const showTabInBox = (tab) => {
        setActiveTab(tab);
        setTargets(tab.items);
        console.log("newTab targets:", tab.items);
    };

    const closeActiveTab = () => {
        setActiveTab(null);
        setTargets([]);
    };

    return (
        <>
            <h2>장바구니</h2>
            <div className="cart-container">
                <div className="targetcart-container">
                    <div className="left-box">
                        <div className="item-box">
                            {STOCK_PRICE.map((item) => (
                                <div
                                    key={item.id}
                                    id={item.id}
                                    draggable
                                    onDragStart={dragStartHandler}
                                    onDrag={dragHandler}
                                    onDragEnd={dragEndHandler}
                                    className="item-node"
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>

                        <div className="item-box">
                            {savedTabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    ref={el => tabRefs.current[tab.id] = el}
                                    className="item-node saved-tab" onClick={() => showTabInBox(tab)}>
                                    <div className="saved-tab-content">
                                        {tab.name}
                                    </div>
                                    <div
                                        className="circle"
                                        onClick={() => handleAnimation(tab.id)}
                                        ref={el => circleRefs.current[tab.id] = el}
                                    >
                                        <span className="icon">
                                            <FaTrashAlt />
                                        </span>
                                        <div
                                            className="circle_loader"
                                            ref={el => circleLoaderRefs.current[tab.id] = el}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div ref={targetBoxRef} className="target-box" onDragOver={(e) => e.preventDefault()}>
                        {/* {targets.map((target) => (
                            <div
                                key={target.stamp_id}
                                id={target.stamp_id}
                                draggable
                                onDragStart={targetDragStartHandler}
                                onDrag={dragHandler}
                                onDragEnd={targetDragEndHandler}
                                className="target-item"
                                style={{ top: `${target.top}px`, left: `${target.left - 80}px` }}
                            >
                                <div className="icon-row">
                                    <div className="pin-icon">
                                        <BsPinAngleFill />
                                    </div>
                                    <button onClick={() => deleteTarget(target.stamp_id)} className="close-delete-button">
                                        <IoMdCloseCircleOutline />
                                    </button>
                                </div>
                                <div>
                                    {target.details.name} - {target.details.price}원
                                </div>
                                <img src={target.details.image} alt={target.details.name} width="140" height="140" />
                            </div>
                        ))} */}

                        {targets.map((target) => (
                            <div
                                key={target.stamp_id}
                                id={target.stamp_id}
                                className="target-item"
                                style={{ top: `${target.top}px`, left: `${target.left - 80}px` }}

                            >
                                <div className="icon-row">
                                    <div
                                        className="pin-icon top-center-handle"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            targetDragStartHandler(e, target.stamp_id);
                                        }}
                                    >
                                        <BsPinAngleFill />
                                    </div>
                                    <button onClick={() => deleteTarget(target.stamp_id)} className="close-delete-button">
                                        <IoMdCloseCircleOutline />
                                    </button>
                                </div>
                                <img src={target.details.image} alt={target.details.name} width="140" />
                                <div>
                                    {target.details.name} - {target.details.price}원
                                </div>
                            </div>
                        ))}

                        {activeTab && (
                            <div className="active-tab">
                                <button className="close-tab-button" onClick={closeActiveTab}>
                                    <IoMdCloseCircleOutline />
                                </button>
                                <p>{activeTab.name}</p>
                            </div>
                        )}

                        <div className="cartsave-button-container">
                            <div id="first" className="cartsave-buttonBox">
                                <button className="cartsave-button" onClick={addTabToSecondBox}>
                                    SAVE
                                </button>
                                <div className="border"></div>
                                <div className="border"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Mypage_Cart;