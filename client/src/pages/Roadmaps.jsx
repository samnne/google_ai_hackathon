import React, { useCallback, useEffect, useState } from "react";

import { Link } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import RoadMapModal from "../components/RoadMapModal";
import { updateList } from "../reducers/cardListSlice";
import { FaCheck, FaPencilAlt, FaTimes } from "react-icons/fa";
import { createCard } from "../reducers/rootSlice";
import { initalName, saveAllRM, saveToDB } from "../utils/utils";
import { auth } from "../../config/firebase-config";
import { API_URL } from "../utils/constants";

const Roadmaps = () => {
  const globalCardList = useSelector((state) => state.cardList.value);
  const rootCard = useSelector((state) => state.rootCard.value);
  const dispatch = useDispatch();
  const cUser = useSelector((state) => state.curUser.value);
  const [newMap, setNewMap] = useState({});
  const [edit, setEdit] = useState(false);
  const [mapName, setMapName] = useState({});


  const fetchData = useCallback(async () => {
    const response = await fetch(
      `${API_URL}/api/user/map/${cUser?.uid}`,
      { method: "get" }
    );
    const data = await response.json();
    return data;
  }, []);

  useEffect(() => {
    if (globalCardList.length > 0) {
      dispatch(updateList([...globalCardList]));
    }

    const init = JSON.parse(localStorage.getItem("roadmaps"))
      ? JSON.parse(localStorage.getItem("roadmaps"))
      : [];

    const initalValueFromLs = init?.filter((card) => {
      const {uid} = card;
      if (!uid){
      
        return card;
      } 
      return;
    });


    fetchData().then((data) => {

      if (data.data.length > 0) {
        dispatch(updateList([...data.data]));
      } else {
        dispatch(updateList([...initalValueFromLs]));
      }
    });

    const newName = globalCardList.find((obj) => obj.name === initalName);
    setNewMap(newName);
  }, []);

  async function saveRoadMap() {
    for (let i = 0; i < globalCardList.length; i++) {
      saveAllRM(
        "UPDATE",
        globalCardList,
        rootCard,
        rootCard.find((card) => card._id === globalCardList[i]._id),
        globalCardList[i]._id,
        dispatch,
        createCard
      );
    }
    saveToDB(null, auth.currentUser, globalCardList);
  }

  function handleChange(e) {
    setMapName((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }
  function getRoadmapData(e, id) {
  
    const findMap = globalCardList.find((map) => map._id === id);
  
    setMapName(findMap);
    setEdit(true);
  }
  async function changeName(e, id) {
    const otherMaps = globalCardList.filter((map) => map._id !== id);
    const findMap = {
      ...globalCardList.find((map) => map._id == id),
      ["name"]: mapName.name,
    };

    dispatch(updateList([findMap, ...otherMaps]));

    let copiedObj = [...globalCardList].map((card) => {
      return {
        name: card.name,
        _id: card._id,
        uid: cUser?.uid || auth.currentUser?.uid,
      };
    });

    if (cUser?.uid && copiedObj.length > 0) {
      const data = await fetch(
        `${API_URL}/${findMap?._id}`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ copiedObj: copiedObj }),
        }
      );
      data;
    }

    setEdit((prev) => !prev);
  }

  function deleteRoadmap(e, id) {
    const roadmapList = globalCardList.filter((map) => map._id !== id);
    const roadMap = rootCard.filter((card) => card._id !== id);

    dispatch(createCard(roadMap));
    dispatch(updateList(roadmapList));
    saveAllRM("DELETE", roadmapList, roadMap);
  }

  return (
    <>
      <div className="min-h-[80vh] p-7 gap-5 grid grid-cols-2 max-sm:grid-cols-1">
        {globalCardList.map((r) => {
          return (
            <div
              className=" max-sm:w-70 hover:drop-shadow-yellow-400 drop-shadow-xl drop-shadow-gray-900 transition-all duration-200 max-sm:h-70 min-sm:w-80 h-80 relative flex-col flex   dark:bg-gray-800 dark:shadow-gray-800  justify-self-center rounded-2xl p-5 "
              key={r._id}
            >
              <div className="w-full h-fit gap-2 flex items-center justify-between">
                <button
                  onClick={(e) => deleteRoadmap(e, r._id)}
                  className="text-sm  p-2 bg-red-300 order-2 h-fit  cursor-pointer hover:bg-red-500 transition-all  rounded-full"
                >
                  <FaTimes />
                </button>

                {edit ? (
                  r._id === mapName._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={mapName.name}
                        onChange={handleChange}
                        name="name"
                        className="dark:hover:bg-blue-800 p-2  text-gray-200 rounded-2xl font-bold w-full cursor-pointer transition-all duration-300"
                      ></input>
                      <button
                        onClick={(e) => changeName(e, r._id)}
                        className="bg-blue-500 flex cursor-pointer hover:bg-blue-200 transition-all justify-center rounded-full p-2 h-fit"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  ) : (
                    <div className="group hover:scale-110 transform transition-all">
                      <Link
                        to={`/roadmap/${r._id}`}
                        className=" p-2 rounded-2xl z-10 dark:text-gray-200 font-bold text-4xl cursor-pointer transition-all duration-300"
                      >
                        {r.name}
                      </Link>
                      <button
                        onClick={(e) => getRoadmapData(e, r._id)}
                        className="warning-button    text-amber-400"
                      >
                        <FaPencilAlt />
                      </button>
                    </div>
                  )
                ) : (
                  <div className="group hover:scale-110 transform transition-all">
                    <Link
                      to={`/roadmap/${r._id}`}
                      className=" p-2 rounded-2xl  z-10 dark:text-gray-200 font-bold text-4xl cursor-pointer transition-all duration-300"
                    >
                      {r.name}
                    </Link>
                    <button
                      onClick={(e) => getRoadmapData(e, r._id)}
                      className="warning-button  text-amber-400"
                    >
                      <FaPencilAlt />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* <CardModal setState={null} overlayRef={overlayRef} modalRef={modalRef}  /> */}

        <RoadMapModal showModal={newMap} />

        <button
          onClick={saveRoadMap}
          className="fixed min-sm:bottom-20 bottom-5 right-5 min-sm:right-20 hover:scale-110 font-bold tracking-widest hover:cursor-pointer primary-button"
        >
          Save
        </button>
      </div>
    </>
  );
};

export default Roadmaps;
