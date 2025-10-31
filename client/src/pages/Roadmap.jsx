import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import RoadMapCard from "../components/RoadMapCard";

import { client, schema } from "../api/apiClient";
import { useDispatch, useSelector } from "react-redux";
import {
  createResponse,
  displayModal,
  saveAllRM,
  saveToDB,
} from "../utils/utils";
import { useLocation, useNavigate, useParams } from "react-router";
import CardModal from "../components/CardModal";
import { createCard } from "../reducers/rootSlice";
import { auth } from "../../config/firebase-config";
import { API_URL } from "../utils/constants";

const Roadmap = () => {
  const { _id } = useParams();

  const dispatch = useDispatch();
  const location = useLocation();
  const rootCard = useSelector((state) => state.rootCard.value);
  const globalCardList = useSelector((state) => state.cardList.value);
  const cUser = useSelector((state) => state.curUser.value);
  const [cardGraph, setCardGraph] = useState({});
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState([]);
  const [serverData, setServerData] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedWidget, setSelectedWidget] = useState(null);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const [modalData, setModalData] = useState({});

  const fetchData = useCallback(async () => {
    const response = await axios.get(
      `${API_URL}/api/user/getMap/${cUser?.uid}`
    );
    const serverMaps = response.data.data;
    const onlyDups = [];
    for (let item of serverData) {
      onlyDups.push(item);
    }

    for (let item of rootCard) {
      let found = false;
      for (let newItem of onlyDups) {
        if (item._id === newItem._id) {
          found = true;
          break;
        }
      }
      if (found) continue;
      onlyDups.push(item);
    }
    dispatch(createCard([...onlyDups]));

    const currentMap = serverMaps.find((map) => map._id === _id);

    console.log(currentMap, "131");
    if (currentMap && currentMap.nodesMap) {
      const transformed = {
        _id: currentMap._id,
        uid: currentMap.uid,
        ...currentMap.nodesMap,
      };

      setCardGraph(transformed);
      setWidgets(Object.keys(currentMap.nodesMap));
    }
  }, [_id, cUser?.uid]);

  useEffect(() => {
    document.title = "Roadmap - Google AI";

    if (!auth.currentUser) {
      navigate("/profile");
      return;
    }

    fetchData();
    const validCard = rootCard.find((card) => card._id === _id);

    if (!validCard) {
      console.log("Card not found");
      return;
    }

    let cardData;
    if (validCard.nodesMap) {
      cardData = {
        _id: validCard._id,

        ...validCard.nodesMap,
      };
    } else {
      cardData = validCard;
    }

    setCardGraph(cardData);

    const nodeKeys = Object.keys(cardData).filter(
      (key) => key !== "_id" && key !== "uid"
    );

    setWidgets(nodeKeys);
  }, [document.title, fetchData]);

  async function graphInsert(parent) {
    let fullResponse = "";

    const thePrompt = `Given the current learning path JSON: '''json ${JSON.stringify(
      cardGraph
    )}
    '''. Generate what a person would learn next, given the PREVIOUS OBJECT ->'''json${JSON.stringify(
      cardGraph[parent]
    )}''' DO NOT REPEAT THE SAME DATA AS THE PREVIOUS OBJECT CREATE A NEW ID!
    Your response should return valid JSON and valid JSON only. The Json should follow the properties of this JSON Schema ${JSON.stringify(
      schema()
    )}`;

    try {
      setLoading(true);

      const result = await client.promptStreaming(thePrompt);

      fullResponse = await createResponse(result);
      console.log(fullResponse);
      const newNode = JSON.parse(fullResponse);
      setCardGraph((prev) => {
        console.log(newNode);

        const step = Object.keys(newNode);

        newNode[step].id = prev[parent].id + 1;
        newNode[step].nei = [];
        newNode[step].position = {
          x: prev[parent].position.x + 50,
          y: prev[parent].position.x + 50,
        };

        const neighbours = [...prev[parent].nei, newNode[step].topic];

        return {
          ...prev,
          [parent]: { ...prev[parent], nei: neighbours },
          ...newNode,
        };
      });

      setWidgets((prev) => [...prev, Object.keys(newNode)[0]]);
    } catch (e) {
      console.log(e, "helo");
    } finally {
      setLoading(false);
    }
  }

  const updateWidget = (id, updates) => {
    setWidgets(
      widgets.map((widget) => {
        if (cardGraph[widget].id === id) {
          setCardGraph((prev) => {
            return { ...prev, [widget]: { ...cardGraph[widget], ...updates } };
          });
        }
        return widget;
      })
    );
  };

  const viewCard = (card) => {
    displayModal(overlayRef, modalRef);
    if (!location.pathname.includes("top")) {
      location.pathname = location.pathname + "top";
    } else {
      location.pathname = location.pathname.slice(
        0,
        location.pathname.length - 3
      );
    }
    setModalData(card);
  };

  async function saveRoadMap() {
    const newArray = rootCard.filter((card) => card._id !== _id);

    newArray.push({ ...cardGraph, _id: _id });

    dispatch(createCard(newArray));

    // saveAllRM(
    //   "UPDATE",
    //   globalCardList,
    //   rootCard,
    //   cardGraph,
    //   _id,
    //   dispatch,
    //   createCard
    // );
    // localStorage.setItem("roadmap", JSON.stringify(newArray));

    saveToDB(cardGraph, auth.currentUser, globalCardList);
  }

  return (
    <>
      <section className="min-h-[80vh] ">
        <header className="flex items-center">
          <h1 className="text-3xl font-bold m-5 dark:text-white">
            {globalCardList.find((map) => map._id === _id)?.name
              ? globalCardList.find((map) => map._id === _id)?.name
              : "Your Roadmap"}
          </h1>
          <button onClick={saveRoadMap} className="primary-button font-bold">
            Save
          </button>
        </header>

        <div className="flex max-sm:justify-center max-sm:px-4 flex-wrap gap-4 relative ">
          {widgets.map((key) => {
            return (
              <RoadMapCard
                key={key}
                taskName={key}
                createCard={graphInsert}
                cardGraph={cardGraph}
                position={cardGraph[key]?.position}
                viewCard={viewCard}
                id={cardGraph[key]?.id}
                loading={loading}
                onUpdate={updateWidget}
                isSelected={selectedWidget === cardGraph[key]?.id}
                onSelect={setSelectedWidget}
              />
            );
          })}
        </div>
        {loading && (
          <div
            style={{
              left: cardGraph[widgets[widgets.length - 1]]?.position?.x + 25,
              top: cardGraph[widgets[widgets.length - 1]]?.position?.y + 25,
            }}
            className="p-5 animate-pulse bg-white cursor-pointer shadow rounded-2xl justify-self-center max-sm:w-70 w-80 h-auto "
          >
            <h1 className="bg-gray-400 w-full h-12 rounded-2xl"></h1>
            <p className="bg-gray-400 w-fit h-20 rounded-2xl"></p>
            <p className="bg-gray-400 w-full h-6 rounded-2xl"></p>

            <button className="bg-gray-400 px-2 w-12 h-4 py-1 rounded-2xl"></button>
          </div>
        )}
        <CardModal
          overlayRef={overlayRef}
          modalRef={modalRef}
          setState={setModalData}
          cardData={modalData}
        />

        {serverData?.success && (
          <div
            onClick={(e) => {
              if (e.currentTarget.classList.contains("opacity-0")) {
                e.currentTarget.classList.toggle("opacity-0");
                e.currentTarget.classList.toggle("z-[1000]");
                e.currentTarget.classList.toggle("hidden");
              } else {
                e.currentTarget.classList.toggle("opacity-0");
                e.currentTarget.classList.toggle("hidden");
                e.currentTarget.classList.toggle("z-[1000]");
              }
              setServerData((prev) => ({ ...prev, success: !prev.success }));
            }}
            className="absolute flex justify-center items-center rounded-2xl shadow-lg shadow-gray-800  left-1/2 top-1/2 transform -translate-1/2 text-4xl bg-green-500 p-20 cursor-pointer transition-all hover:scale-125 z-1000"
          >
            <span className="text-white">{serverData?.message}</span>
          </div>
        )}
      </section>
    </>
  );
};

export default Roadmap;
