import { auth } from "../../config/firebase-config";

export async function createResponse(result) {
  let fullResponse = "";

  for await (const chunk of result) {
    fullResponse += chunk;
    console.clear();
    console.log(fullResponse);
  }
  let stack = ["{", "}"];
  let backIdx = fullResponse.length - 1;
  let frontIdx = 0;

  while (stack.includes("{") && stack.includes("}") && frontIdx < backIdx) {
    if (fullResponse[frontIdx] === "{") {
      stack = stack.filter((item) => item !== "{");
      break;
    }
    if (fullResponse[backIdx] === "}") {
      stack = stack.filter((item) => item !== "}");
      break;
    }
    console.log(fullResponse.slice(frontIdx, backIdx + 1));
    frontIdx++;
    backIdx--;
  }
  console.log(stack);
  while (stack.includes("{")) {
    if (fullResponse[frontIdx] !== "{") {
      frontIdx++;
    } else {
      stack.pop();
      break;
    }
  }
  while (stack.includes("}")) {
    if (fullResponse[backIdx] !== "}") {
      backIdx--;
    } else {
      stack.pop();
      break;
    }
  }

  fullResponse = fullResponse.slice(frontIdx, backIdx + 1);
  console.log(fullResponse);
  return fullResponse;
}

export function displayModal(oRef, mRef) {
  const overlay = oRef.current;
  const modal = mRef.current;
  if (
    modal.classList.contains("opacity-0") &&
    modal.classList.contains("-z-10")
  ) {
    modal.classList.replace("opacity-0", "opacity-100");
    modal.classList.replace("-z-10", "z-30");
    modal.classList.replace("translate-y-0", "translate-y-25");
  } else {
    modal.classList.replace("opacity-100", "opacity-0");
    modal.classList.replace("z-30", "-z-10");
    modal.classList.replace("translate-y-25", "translate-y-0");
  }
  if (
    overlay.classList.contains("opacity-0") &&
    overlay.classList.contains("-z-10")
  ) {
    overlay.classList.replace("opacity-0", "opacity-20");
    overlay.classList.replace("-z-10", "z-10");
  } else {
    overlay.classList.replace("opacity-20", "opacity-0");
    overlay.classList.replace("z-10", "-z-10");
  }
}

export function saveAllRM(
  ACTION,
  globalCardList,
  rootCard,
  roadMap,
  _id,
  dispatch,
  stateFunction
) {
  const newArray = rootCard.filter((card) => card._id !== _id);
  switch (ACTION) {
    case "UPDATE":
      newArray.push({ ...roadMap, _id: _id });

      dispatch(stateFunction(newArray));

      localStorage.setItem("roadmap", JSON.stringify(newArray));
      localStorage.setItem("roadmaps", JSON.stringify(globalCardList));
      break;
    case "DELETE":
      localStorage.setItem("roadmap", JSON.stringify(newArray));
      localStorage.setItem("roadmaps", JSON.stringify(globalCardList));
      break;
  }
}

const init = JSON.parse(localStorage.getItem("roadmap"))
  ? JSON.parse(localStorage.getItem("roadmap"))
  : [];

const fetchData = async () => {
  const res = await fetch(
    `http://localhost:3000/api/user/getMap/${auth.currentUser?.uid}`
  );

  return res.json();
};

const transformRoadmap = (roadmap) => {
  if (roadmap.nodesMap) {
    const { nodesMap, _id, uid } = roadmap;
    return {
      _id,
      uid,
      ...JSON.parse(nodesMap),
    };
  }

  return roadmap;
};

const data = await fetchData().then((data) => {
  return data.data.map((roadmap) => transformRoadmap(roadmap));
});

export const initialState = init.length > data.length ? init : data;

export const initalName = "new";

export async function saveToDB(cardGraph, currentUser, globalCardList) {
  let copiedObj = {
    _id: cardGraph._id,
    uid: currentUser?.uid || cardGraph.uid,
    nodesMap: {},
  };
  if (cardGraph) {
    Object.keys(cardGraph).forEach((key) => {
      if (key !== "_id" && key !== "uid") {
        copiedObj.nodesMap[key] = cardGraph[key];
      }
    });

    copiedObj = {
      _id: cardGraph._id,
      uid: currentUser?.uid || cardGraph.uid,
      nodesMap: JSON.stringify({ ...copiedObj.nodesMap }),
    };


    if (currentUser?.uid && copiedObj) {
      const data = await fetch("http://localhost:3000/api/user/createMap", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copiedObj }),
      });
      data;
    }
  } else {
    copiedObj = [...globalCardList].map((card) => {
      return {
        name: card.name,
        _id: card._id,
        uid: currentUser?.uid || auth.currentUser?.uid,
      };
    });
    console.log(copiedObj);

    if (currentUser?.uid && copiedObj.length > 0) {
      const data = await fetch("http://localhost:3000/api/user/roadmaps", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copiedObj: copiedObj }),
      });
      data;
    }
  }
}
