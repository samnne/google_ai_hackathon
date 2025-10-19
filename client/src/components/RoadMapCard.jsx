import React, { useCallback, useEffect, useState } from "react";

import { FaArrowsAlt } from "react-icons/fa";
const RoadMapCard = ({
  createCard,
  cardGraph,
  taskName,
  viewCard,
  id,

  position,
  onUpdate,

  isSelected,
  onSelect,
}) => {


  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, id) => {
    const elem = document.getElementById(id);
    if (!elem) return;

    setIsDragging(true);

    const rect = elem.getBoundingClientRect();
    console.log(rect.x, rect.y);
    console.log(e.pageX, e.clientY);
    setDragOffset({
      x: e.pageX - (rect.left + window.scrollX),
      y: e.pageY - (rect.top + window.scrollY) + 200,
    });
    onSelect(id);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const newPosition = {
        x: e.pageX - dragOffset.x,
        y: e.pageY - dragOffset.y,
      };

      console.log(newPosition);
      onUpdate(id, { position: newPosition });
    },
    [isDragging, dragOffset, id, onUpdate]
  );

  useEffect(() => {
    const handleMouseUp = () => {
      onSelect(null);
      setIsDragging(false);
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, onSelect]);
  // console.log("#################################",position, taskName)
  //console.log(id, position, taskName)
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          createCard(taskName);
        }}
        key={taskName}
        className={`p-5 gap-2
          ${
            cardGraph[taskName]?.difficulty === "beginner"
              ? "bg-green-200 dark:bg-green-900"
              : cardGraph[taskName]?.difficulty === "intermediate"
              ? "bg-yellow-200 dark:bg-yellow-500"
              : cardGraph[taskName]?.difficulty === "advanced"
              ? "dark:bg-red-400 bg-red-200"
              : "bg-white"
          }
          ${isDragging ? "cursor-move" : "cursor-default"} ${
          isSelected ? "shadow-green-400 animate-pulse" : ""
        } flex  flex-col  dark:text-gray-200 font-semibold  min-sm:absolute  shadow-lg dark:shadow-gray-800 rounded-2xl w-80 h-auto `}
        style={{
          left: position?.x,
          top: position?.y,
          zIndex: isSelected ? 1000 : 1,
          userSelect: "none",
        }}
        id={id}
      >
        <div className="flex justify-between items-center">
          <h1 className="font-bold  text-2xl">{cardGraph[taskName]?.topic}</h1>
          <a
            className="flex items-center max-sm:hidden hover:bg-gray-200 p-2 justify-center rounded-2xl cursor-pointer "
            onMouseDown={(e) => handleMouseDown(e, id)}
          >
            <FaArrowsAlt />
          </a>
        </div>
        <div className="grow">
          <p>{cardGraph[taskName]?.description}</p>
          <p className="italic font-bold capitalize">
            Leads to:{" "}
            {cardGraph[taskName]?.nei?.map((n) => n).join(", ") || "None"}
          </p>
        </div>
        <div className="flex gap-2 ">
          <a
            type=""
            onClick={() => viewCard(cardGraph[taskName])}
            className="view-button shadow-lg"
          >
            View
          </a>
          <button className="danger-button shadow-lg">
            Next Step
          </button>
        </div>
      </form>
    </>
  );
};

export default RoadMapCard;
