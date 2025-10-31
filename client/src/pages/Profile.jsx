import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaGoogle, FaTimes } from "react-icons/fa";
import { auth, provider } from "../../config/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { setUser } from "../reducers/userSlice";

const SignUp = ({ profilePage }) => {
  const init = {
    name: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(init);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const signUp = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      const serializableUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
      };

      dispatch(setUser(serializableUser));
      setFormData(init);
      profilePage();
    } catch (error) {
      console.log(error);
    }
  };

  const signUpWithGoogle = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);

      const serializableUser = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
      };

      dispatch(setUser(serializableUser));
      profilePage();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <form
        onSubmit={signUp}
        className="bg-white dark:bg-gray-800 rounded-2xl flex flex-col justify-center items-start gap-2 shadow p-10 "
      >
        <div className="flex max-sm:flex-col text-gray-300  gap-4">
          <div className="flex-col flex">
            <label className="pl-5 pt-5" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              onChange={handleChange}
              name="name"
              value={formData.name}
              placeholder="Name..."
              className="p-5 shadow dark:drop-shadow dark:shadow-gray-600 rounded-2xl focus:outline-0"
            />
          </div>
          <div className="flex-col flex">
            <label className="pl-5 pt-5" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              onChange={handleChange}
              name="email"
              value={formData.email}
              placeholder="Email..."
              className="p-5 shadow dark:drop-shadow dark:shadow-gray-600 rounded-2xl focus:outline-0"
            />
          </div>
        </div>
        <div className="flex flex-col w-full text-gray-300">
          <label className="pl-5 pt-5" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password..."
            className="p-5 shadow dark:drop-shadow dark:shadow-gray-600 rounded-2xl focus:outline-0"
          />
        </div>
        <div className="flex justify-end mt-5 gap-4  flex-col text-gray-300 font-semibold w-full">
          <button className="justify-center p-2 flex items-center gap-2 hover:bg-blue-300 transition-all cursor-pointer bg-blue-500 rounded-2xl">
            Sign Up
          </button>

          <button
            onClick={signUpWithGoogle}
            className=" p-2 flex justify-center items-center gap-2 bg-red-500 rounded-2xl text-black cursor-pointer hover:bg-red-300 transition-all"
          >
            <span className="flex gap-2 justify-center items-center text-gray-300">
              Sign In With Google <FaGoogle className="text-green-800 " />
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

const SignIn = ({ profilePage }) => {
  const init = {
    name: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(init);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const signIn = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const serializableUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
      };

      setFormData(init);
      dispatch(setUser(serializableUser));
      profilePage();
    } catch (error) {
      console.log(error);
    }
  };

  const signUpWithGoogle = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);

      // ✅ Get user from the result
      const serializableUser = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
      };

      dispatch(setUser(serializableUser));
      profilePage();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <form
        onSubmit={signIn}
        className="bg-white dark:bg-gray-800 rounded-2xl  flex flex-col justify-center items-start gap-2 shadow p-10 "
      >
        <div className="flex-col w-full flex text-gray-300">
          <label className="pl-5 font-bold pt-5" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            onChange={handleChange}
            name="email"
            value={formData.email}
            placeholder="Email..."
            className="p-5 shadow dark:drop-shadow dark:shadow-gray-600  rounded-2xl focus:outline-0"
          />
        </div>
        <div className="flex flex-col w-full text-gray-300">
          <label className="pl-5 pt-5" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password..."
            className="p-5 shadow dark:drop-shadow dark:shadow-gray-600 rounded-2xl focus:outline-0"
          />
        </div>
        <div className="flex flex-col text-gray-300 font-semibold w-full gap-2 mt-5">
          <button className="p-2  justify-center items-center   hover:bg-blue-300 transition-all cursor-pointer bg-blue-500 rounded-2xl">
            Sign In
          </button>

          <button
            onClick={signUpWithGoogle}
            className="p-2 flex items-center gap-2 justify-center bg-red-500 rounded-2xl text-black cursor-pointer hover:bg-red-300 transition-all"
          >
            <span className="flex justify-center items-center text-gray-300 font-semibold gap-2 ">
              Sign In With Google <FaGoogle className="text-green-800 " />
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

const Profile = () => {
  const globalCardList = useSelector((state) => state.cardList.value);
  //const [changePage, setSignInSignUp] = useState("up");
  const dispatch = useDispatch();
  const cUser = useSelector((state) => state.curUser.value);

  const showProfile = !!cUser?.uid;

  useEffect(() => {
    if (!cUser?.uid && auth.currentUser) {
      const serializableUser = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        emailVerified: auth.currentUser.emailVerified,
      };
      dispatch(setUser(serializableUser));
    }
  }, [dispatch, cUser?.uid]);

  const handleAuthSuccess = () => {
    if (auth.currentUser) {
      const serializableUser = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        emailVerified: auth.currentUser.emailVerified,
      };
      dispatch(setUser(serializableUser));
    }
  };
  
  return (
    <>
      <main
        className={`font-noto gap-5 flex-col h-[80dvh] flex p-5 ${
          showProfile ? "" : "justify-center items-center "
        } `}
      >
        {showProfile ? (
          <section className="w-full h-full flex flex-col justify-between">
            <header className="font-bold dark:text-yellow-500 text-4xl p-4">
              <h1>
                {cUser?.displayName
                  ? `Hey ${cUser?.displayName}!`
                  : "Welcome Back!"}{" "}
              </h1>
            </header>
            <section className="  gap-15   grid grid-cols-3 max-sm:grid-cols-1 sm:grid-rows-1">
              {globalCardList.map((r) => {
                return (
                  <Link
                    to={`/roadmap/${r._id}`}
                    className="h-20 hover:scale-105 max-sm:w-60 w-full  transition-all duration-200 overflow-x-hidden shadow-lg dark:bg-gray-800 dark:text-white text-center items-center flex justify-center font-semibold tracking-wider text-xl dark:hover:shadow-yellow-600 bg-white p-5 justify-self-center rounded-2xl cursor-pointer"
                  >
                    {r.name}
                  </Link>
                );
              })}
            </section>
            <section className="sm:p-5 p-2 mt-5 w-full shadow-lg h-96 rounded-2xl text-yellow-500 dark:bg-gray-800 bg-white">
              <div className="flex justify-between max-sm:p-4">
                <header className="flex gap-2 ">
                  <div className="max-sm:hidden">
                    <img
                      src={auth.currentUser?.photoURL}
                      alt=""
                      className="bg-blue-500 rounded-full"
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="flex ">{cUser?.displayName}</h3>

                    <span className="text-gray-400 text-sm">
                      {cUser?.email}
                    </span>
                  </div>
                </header>
                <div className="flex bg-gray-200 cursor-pointer h-full p-2 rounded-full justify-center hover:bg-gray-500 items-center">
                  <FaTimes />
                </div>
              </div>
            </section>
          </section>
        ) : (
          <SignIn profilePage={handleAuthSuccess} />
        )}

        {/* <SignUp profilePage={handleAuthSuccess} /> */}
        {/* {showProfile ? (
          <></>
        ) : (
          <div className="flex ">
            <button
              onClick={() =>
                setSignInSignUp((prev) => (prev === "up" ? "in" : "up"))
              }
              className="bg-yellow-400 transition-all px-4 py-2 rounded-2xl cursor-pointer hover:bg-yellow-200"
            >
              {changePage === "up" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        )} */}
      </main>
    </>
  );
};

export default Profile;
