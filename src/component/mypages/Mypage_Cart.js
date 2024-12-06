import { useState, useRef, useEffect } from "react";
import "../css/Mypage_Cart.css";
import { BsPinAngleFill } from "react-icons/bs";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaTrashAlt } from 'react-icons/fa';

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
    const [stock, setStock] = useState([]);

    // 선택된 항목을 저장하는 상태
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태

    // 삭제 중인 항목들을 추적하는 상태
    const [deletingItems, setDeletingItems] = useState([]);

    // 로딩 상태
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    let posX = 0;
    let posY = 0;
    const originalX = useRef(0);
    const originalY = useRef(0);
    const offsetX = useRef(0);
    const offsetY = useRef(0);

    useEffect(() => {
        const updateBox = () => {
            if (targetBoxRef.current) {
                const box = targetBoxRef.current.getBoundingClientRect();
                setBox({
                    top: box.top,
                    left: box.left,
                    bottom: box.top + box.height,
                    right: box.left + box.width,
                });
            }
        };

        // 초기 렌더링 시 box 좌표 계산
        updateBox();

        // 창 크기 변경 시 box 좌표 업데이트
        window.addEventListener("resize", updateBox);

        return () => window.removeEventListener("resize", updateBox);
    }, []);

    // 컴포넌트 마운트 시 API에서 데이터 가져오기
    useEffect(() => {
        const fetchCartItems = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/cart/items`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem('accessToken'),
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched cart items:", data); // 데이터 로그 찍기

                // 데이터 상태에 저장
                setStock(data);
            } catch (error) {
                console.error("Failed to fetch cart items:", error);
                alert("장바구니 데이터를 가져오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartItems();
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
                }, 100);
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
            const details = stock.find((item) => item.id === targetId);

            if (!details) return;

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
            }))
        };

        setSavedTabs([...savedTabs, newTab]);
        setTargets([]);
        console.log("newTab targets:", newTab.items);
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
            setSelectedItems(stock.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    // 개별 체크박스 핸들러
    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter((id) => id !== itemId)
                : [...prevSelectedItems, itemId];
            setSelectAll(newSelectedItems.length === stock.length);
            return newSelectedItems;
        });
    };

    // 수량 업데이트
    const [amount, setAmount] = useState({});

    // API로부터 데이터를 가져온 후 초기 amount 설정
    useEffect(() => {
        const initialAmount = {};
        stock.forEach(item => {
            initialAmount[item.id] = item.quantity;
        });
        setAmount(initialAmount);
    }, [stock]);

    // 선택된 상품 삭제
    const deleteSelectedItems = async () => {
        if (selectedItems.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }

        // 사용자 확인
        const confirmDelete = window.confirm("선택한 항목들을 삭제하시겠습니까?");
        if (!confirmDelete) return;

        setIsDeleting(true);

        try {
            // DELETE 요청을 병렬로 처리
            const deletePromises = selectedItems.map(async (id) => {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/cart/items/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem('accessToken') || '', // Bearer 제외
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete item with id ${id}. Status: ${response.status}`);
                }

                return id;
            });

            // 모든 DELETE 요청 완료 대기
            const deletedIds = await Promise.all(deletePromises);
            console.log("Successfully deleted items:", deletedIds);

            // Fade-out 애니메이션 트리거
            setDeletingItems(deletedIds);

            // 애니메이션 시간 후 UI에서 삭제
            setTimeout(() => {
                setStock((prevStock) => prevStock.filter((item) => !deletedIds.includes(item.id)));
                setSelectedItems([]);
                setSelectAll(false);
                setDeletingItems([]);
                alert("선택한 항목들이 성공적으로 삭제되었습니다.");
            }, 500); // 0.5초 후 삭제 (애니메이션 시간과 맞춤)

        } catch (error) {
            console.error("Error deleting selected items:", error);
            alert("선택한 항목들을 삭제하는 데 실패했습니다.");
        } finally {
            setIsDeleting(false);
        }
    };

    // 수량 변경
    const handleAmountChange = (itemId, newAmount) => {
        setAmount((prevAmount) => ({
            ...prevAmount,
            [itemId]: newAmount,
        }));
    };

    // 선택된 항목들의 총 가격 계산
    const selectedTotalPrice = stock.reduce((acc, item) => {
        return selectedItems.includes(item.id) ? acc + item.price * amount[item.id] : acc;
    }, 0);

    return (
        <>
            <h2>장바구니</h2>
            <div className="cart-container">
                <div className="targetcart-container">
                    <div className="left-box">
                        <div className="item-box">
                            {stock.map((item) => (
                                <div
                                    key={item.id}
                                    id={item.id}
                                    draggable
                                    onDragStart={dragStartHandler}
                                    onDrag={dragHandler}
                                    onDragEnd={dragEndHandler}
                                    className="item-node"
                                >
                                    {item.productName}
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
                                <img src={target.details.productImage} alt={target.details.productName} width="140" />
                                <div>
                                    {target.details.productName}
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
                        * 배송은 2-5일 정도 소요되며 택배사의 상황에 따라 지연될 수 있습니다 *
                    </p>

                    {isLoading ? (
                        <p>로딩 중...</p>
                    ) : (
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
                                    <tr
                                        key={item.id}
                                        data-id={item.id}
                                        className={deletingItems.includes(item.id) ? 'fade-out' : ''}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleCheckboxChange(item.id)}
                                            />
                                        </td>
                                        <td>
                                            <img src={item.productImage} alt={item.productName} className="product-image" />
                                        </td>
                                        <td>
                                            <span>{item.productName}</span>
                                        </td>
                                        <td>
                                            <span>{item.size} / </span>
                                            <span>{item.color}</span>
                                        </td>
                                        <td>
                                            <select
                                                value={amount[item.id] || item.quantity}
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
                                            <span>{item.price.toLocaleString()} KRW</span>
                                        </td>
                                        <td>
                                            무료 택배
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="cart-actions">
                        <button
                            className="action-button"
                            onClick={deleteSelectedItems}
                            disabled={isDeleting}
                        >
                            {isDeleting ? '삭제 중...' : '선택상품 삭제'}
                        </button>
                    </div>

                    <div className="total-summary">
                        <p>총 주문 상품 {selectedItems.length}개</p>
                        <p>
                            {selectedTotalPrice.toLocaleString()} KRW + 0 KRW = {selectedTotalPrice.toLocaleString()} KRW
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