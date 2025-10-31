import React, { useEffect, useRef, useState } from "react";
import { initialFormData } from "../utils/constants";
import { closeModal, displayModal, saveToDB } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateList } from "../reducers/cardListSlice";

import { auth } from "../../config/firebase-config";

const RoadMapModal = ({ showModal }) => {
  const [formData, setFormData] = useState(initialFormData);
  const modalRef = useRef();
  const overlayRef = useRef();

  const dispatch = useDispatch();
  const copiedModal = { ...showModal };

  const rootCard = useSelector((state) => state.rootCard.value);
  const globalCardList = useSelector((state) => state.cardList.value);
  useEffect(() => {
    if (
      copiedModal?.name === "new" &&
      formData.name === "" &&
      copiedModal?.updated === false
    ) {
      copiedModal.updated = true;
      displayModal(overlayRef, modalRef);
    }
  });

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { _id } = showModal;

    const newList = globalCardList.filter((card) => card._id !== _id);
    dispatch(
      updateList([
        ...newList,
        {
          name: formData.name,
          _id: _id,
        },
      ])
    );

    const firstStep = rootCard.find((card) => card._id === _id);
    saveToDB(
      {
        ...firstStep,
        _id: _id,
        uid: auth.currentUser?.uid,
      },
      auth.currentUser,
      [
        ...newList,
        {
          name: formData.name,
          _id: _id,
        },
      ]
    );

    closeModal(overlayRef, modalRef);
  };

  const viewCard = (e) => {
    e.preventDefault();

    displayModal(overlayRef, modalRef);
  };

  return (
    <div className="p-5 font-noto ">
      <div
        ref={modalRef}
        className="absolute gap-2  overflow-y-auto overflow-x-hidden flex flex-col  opacity-0 p-5 duration-300 transform -0 transition-all inset-0  -z-10 bg-white shadow-lg min-sm:w-1/2 w-full min-sm:h-fit h-80 rounded-2xl translate-y-1/4 top-80 min-sm:translate-1/2   "
      >
        <div className="flex flex-col ">
          <div className="absolute flex justify-center text-center items-center right-2 top-1">
            <a
              className="text-sm  px-2 h-fit justify-self-center items-center  rounded-2xl  bg-blue-500 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                closeModal(overlayRef, modalRef);
              }}
            >
              x
            </a>
          </div>
          <div className="text-2xl capitalize font-bold">
            Give your Roadmap A Name!
          </div>
        </div>
        <form className="gap-2  flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col min-sm:gap-2 gap-1 min-sm:p-5 p-1 w-full ">
            <label
              htmlFor="name"
              className="font-semibold tracking-wider text-xl p-1"
            >
              Roadmap
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="shadow-md p-4 rounded-2xl"
              id="name"
              name="name"
              placeholder="My New RoadMap"
            />
          </div>
          <div className="w-full flex justify-end pe-5">
            <button
              type="submit"
              className="bg-blue-500 font-bold  text-white  cursor-pointer transition-all duration-200 hover:bg-blue-800 rounded-xl w-30 h-8"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      <div
        ref={overlayRef}
        className="overlay h-full transition-all duration-150 opacity-0 absolute inset-0 bg-black -z-10"
      ></div>
    </div>
  );
};

export default RoadMapModal;
