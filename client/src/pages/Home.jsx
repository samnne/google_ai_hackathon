import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { changeValue } from "../reducers/promptSlice";
import { client, schema } from "../api/apiClient";
import { createResponse, initalName } from "../utils/utils";
import { createCard } from "../reducers/rootSlice";
import { updateList } from "../reducers/cardListSlice";
import { v4 as uuid } from "uuid";
import { setUser } from "../reducers/userSlice";
import { auth } from "../../config/firebase-config";
const Home = () => {
  const prompt = useSelector((state) => state.prompt.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootCard = useSelector((state) => state.rootCard.value);
  const globalCardList = useSelector((state) => state.cardList.value);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = "Home - Google AI";

    const serializableUser = {
        uid: auth.currentUser?.uid, 
        email: auth.currentUser?.email,
        displayName: auth.currentUser?.displayName,
        photoURL: auth.currentUser?.photoURL,
        emailVerified: auth.currentUser?.emailVerified,
      };
      if(auth.currentUser){

        dispatch(setUser(serializableUser))
      }
  }, []);

  

  async function initialPrompt(event) {
    event.preventDefault();
    const schemaStr = JSON.stringify(schema());
    const stream = await client.promptStreaming(`
        Hey Prompt Ai, take this prompt: ${prompt}. 
        Generate what a person would learn next. Your response should return valud JSON and valid JSON only. The Json should follow the properties of this JSON Schema ${schemaStr}`);
    try {
      setLoading(true);
      dispatch(changeValue(""));
      const firstStepStr = await createResponse(stream);
      const firstStep = JSON.parse(firstStepStr);
      const step = Object.keys(firstStep)[0];
      firstStep[step].nei = [];
      firstStep[step].position = { x: 25, y: 25 };
      firstStep[step].id = 500;
      const sharedId = uuid();
      dispatch(
        createCard([
          ...rootCard,
          {
            ...firstStep,
            _id: sharedId,
          },
        ])
      );

      dispatch(
        updateList([
          ...globalCardList,
          {
            name: initalName,
            _id: sharedId,
            updated: false,
          },
        ])
      );


      navigate("/roadmap");
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
 
  function inputChange(newValue) {
    dispatch(changeValue(newValue));
  }
  return (
    <section className="min-h-[82dvh] max-sm:p-4 flex-col gap-5 flex justify-around items-center">
      {loading && (
        <div className="loader-spin w-20 h-20 absolute scale-150"></div>
      )}
      <h1 className="font-noto text-center dark:text-yellow-500 font-bold text-shadow-lg text-6xl">
        Begin Your Journey
      </h1>
      <form
        onSubmit={(e) => initialPrompt(e)}
        className="dark:bg-black dark:text-white dark:shadow-gray-900 bg-white font-noto font-bold shadow-lg h-20 gap-5 rounded-3xl sm:w-96  flex items-center p-5"
      >
        <input
          type="text"
          name="prompt"
          value={prompt}
          onChange={(e) => inputChange(e.target?.value)}
          placeholder="Start Your Journey Here."
          className="focus:outline-0 shadow dark:bg-gray-700  bg-gray-200 ps-2 rounded-xl h-8 w-full "
        />
        <button type="submit" className="primary-button text-yellow-500">
          Create
        </button>
      </form>
    </section>
  );
};

export default Home;
