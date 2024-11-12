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
    { id: 1, name: "신발", price: 1000, image: test1, size: 260, color: "BROWN", amount: 1 },
    { id: 2, name: "상하의", price: 2000, image: test2, size: "S", color: "WHITE", amount: 3 },
    { id: 3, name: "셔츠", price: 3000, image: test3, size: "M", color: "GRAY", amount: 8 },
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

    // 상품 목록을 관리하기 위한 상태 추가
    const [stock, setStock] = useState(STOCK_PRICE);

    // 선택된 항목을 저장하는 상태
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태

    let posX = 0;
    let posY = 0;
    // let originalX = 0;
    // let originalY = 0;
    const originalX = useRef(0);
    const originalY = useRef(0);
    const offsetX = useRef(0);
    const offsetY = useRef(0);

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
            const targetId = parseInt(e.target.id);
            const details = STOCK_PRICE.find((item) => item.id === targetId);

            const newTargetItem = {
                stamp_id: parseInt(e.timeStamp),
                top: e.clientY - box.top,
                left: e.clientX - box.left,
                details: details,
            };

            if (activeTab) {
                setTargets((prevTargets) => [...prevTargets, newTargetItem]);
            } else {
                setTargets((prevTargets) => [...prevTargets, newTargetItem]);
            }

            e.target.style.left = "0px";
            e.target.style.top = "0px";
        }
    };

    const editTabChanges = () => {
        if (activeTab) {
            const updatedTab = {
                ...activeTab,
                items: targets.map(target => ({
                    tabId: activeTab.id,
                    stamp_id: target.stamp_id,
                    top: positionRef.current[target.stamp_id]?.top || target.top,
                    left: positionRef.current[target.stamp_id]?.left || target.left,
                    details: target.details,
                }))
            };

            setSavedTabs(prevTabs =>
                prevTabs.map(tab => (tab.id === activeTab.id ? updatedTab : tab))
            );

            setActiveTab(null);
            setTargets([]);
            console.log("Edited tab targets:", updatedTab.items);
        }
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
        e.preventDefault();

        // 배열에서 드래그 중인 아이템을 마지막으로 이동
        setTargets((prevTargets) => {
            const targetIndex = prevTargets.findIndex((target) => target.stamp_id === targetId);
            if (targetIndex !== -1) {
                const targetItem = prevTargets[targetIndex];
                const updatedTargets = [...prevTargets];
                updatedTargets.splice(targetIndex, 1);
                updatedTargets.push(targetItem);
                return updatedTargets;
            }
            return prevTargets;
        });

        const targetItem = targets.find((target) => target.stamp_id === targetId);
        if (targetItem) {
            const itemElement = document.getElementById(targetId);
            const itemRect = itemElement.getBoundingClientRect();
            const boxRect = targetBoxRef.current.getBoundingClientRect();

            // 마우스 포인터와 아이템의 좌상단 사이의 오프셋 계산
            offsetX.current = e.clientX - itemRect.left;
            offsetY.current = e.clientY - itemRect.top;

            // 아이템의 원래 위치 저장
            originalX.current = targetItem.left;
            originalY.current = targetItem.top;

            const handleMouseMove = (moveEvent) => {
                moveEvent.preventDefault();

                const newLeft = moveEvent.clientX - boxRect.left - offsetX.current;
                const newTop = moveEvent.clientY - boxRect.top - offsetY.current;

                setTargets((prevTargets) =>
                    prevTargets.map((target) =>
                        target.stamp_id === targetId
                            ? { ...target, left: newLeft, top: newTop }
                            : target
                    )
                );
            };

            const handleMouseUp = (upEvent) => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);

                // 마우스 위치 체크 및 위치 복귀
                const boxRect = targetBoxRef.current.getBoundingClientRect();
                const mouseX = upEvent.clientX;
                const mouseY = upEvent.clientY;

                if (
                    mouseX >= boxRect.left &&
                    mouseX <= boxRect.right &&
                    mouseY >= boxRect.top &&
                    mouseY <= boxRect.bottom
                ) {
                    // target-box 내부에 놓였을 때 위치 유지
                } else {
                    // target-box 외부에 놓였을 때 이전 위치로 복귀
                    setTargets((prevTargets) =>
                        prevTargets.map((target) =>
                            target.stamp_id === targetId
                                ? { ...target, left: originalX.current, top: originalY.current }
                                : target
                        )
                    );
                }
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
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
                            left: e.clientX + scrollLeft - boxRect.left
                        }
                        : target
                );

                // positionRef 업데이트
                positionRef.current[targetId] = {
                    top: e.clientY + scrollTop - boxRect.top,
                    left: e.clientX + scrollLeft - boxRect.left
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

    // 전체 선택 체크박스 핸들러
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedItems([]); // 전체 해제
        } else {
            setSelectedItems(STOCK_PRICE.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    // 개별 체크박스 핸들러
    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter((id) => id !== itemId)
                : [...prevSelectedItems, itemId];
            setSelectAll(newSelectedItems.length === STOCK_PRICE.length);
            return newSelectedItems;
        });
    };

    // 수량 업데이트
    const [amount, setAmount] = useState(
        STOCK_PRICE.reduce((acc, item) => {
            acc[item.id] = item.amount;
            return acc;
        }, {})
    );

    // 선택된 상품 삭제
    const deleteSelectedItems = () => {
        // 선택된 항목들에 대해 fade-out 클래스 추가
        selectedItems.forEach((itemId) => {
            const row = document.querySelector(`tr[data-id='${itemId}']`);
            if (row) {
                row.classList.add('fade-out');
            }
        });

        // 일정 시간 후에 항목 삭제
        setTimeout(() => {
            setStock((prevStock) => prevStock.filter((item) => !selectedItems.includes(item.id)));
            setSelectedItems([]);
            setSelectAll(false);
        }, 500); // 0.5초 후 삭제 (애니메이션 시간과 맞춤)
    };

    // 수량 변경
    const handleAmountChange = (itemId, newAmount) => {
        setAmount((prevAmount) => ({
            ...prevAmount,
            [itemId]: newAmount,
        }));
    };

    // 선택된 항목들의 총 가격 계산
    const selectedTotalPrice = STOCK_PRICE.reduce((acc, item) => {
        return selectedItems.includes(item.id) ? acc + item.price * amount[item.id] : acc;
    }, 0);


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

                        <button
                            className="reset-button"
                            onClick={() => setTargets([])}
                        >
                            <FaTrashAlt />
                        </button>

                        {targets.map((target) => (
                            <div
                                key={target.stamp_id}
                                id={target.stamp_id}
                                className="target-item"
                                style={{ top: `${target.top}px`, left: `${target.left}px` }}

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
                                <button className="cartedit-button" onClick={editTabChanges}>Edit</button>
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


                <div className="cart-list-container">
                    <h2>Cart</h2>
                    <p className="delivery-info">
                        *배송은 2-5일 정도 소요되며 택배사의 상황에 따라 지연될 수 있습니다. Blotter Card는 우편 발송으로 영업일 기준 5일 이상 소요됩니다.
                    </p>

                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                    />
                                </th>
                                <th>상품 사진</th>
                                <th>상품 이름</th>
                                <th>상품 상세</th>
                                <th>수량</th>
                                <th>주문금액</th>
                                <th>배송 정보</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stock.map((item) => (
                                <tr key={item.id} data-id={item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </td>
                                    <td>
                                        <img src={item.image} alt={item.name} className="product-image" />
                                    </td>
                                    <td>
                                        <span>{item.name}</span>
                                    </td>
                                    <td>
                                        <span>{item.size} / </span>
                                        <span>{item.color}</span>
                                    </td>
                                    <td>
                                        <select
                                            value={amount[item.id]}
                                            onChange={(e) => handleAmountChange(item.id, parseInt(e.target.value))}
                                        >
                                            {[...Array(10).keys()].map((num) => (
                                                <option key={num + 1} value={num + 1}>
                                                    {num + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <span>{item.price} KRW</span>
                                    </td>
                                    <td>
                                        무료 택배
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="cart-actions">
                        <button className="action-button" onClick={deleteSelectedItems}>선택상품 삭제</button>
                    </div>

                    <div className="total-summary">
                        <p>총 주문 상품 {selectedItems.length}개</p>
                        <p>
                            {selectedTotalPrice} KRW + 0 KRW = {selectedTotalPrice} KRW
                        </p>
                    </div>

                    <button className="order-button">주문하기</button>

                    <p className="payment-info">
                        일부 상품은 배송비가 추가될 수 있습니다.
                    </p>
                </div>

            </div>
        </>
    );
}

export default Mypage_Cart;