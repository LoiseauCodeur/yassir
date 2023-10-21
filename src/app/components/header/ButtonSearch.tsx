"use client"
import { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ButtonSearch = () => {
  return (
    <div className="flex m-auto w-full md:w-[30%] mr-5 ml-5 md:mr-0">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Où souhaitez-vous étudier"
          className="w-full border rounded-full border-black-100 p-2 pl-10 shadow-lg"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-3 text-gray-500"
        />
      </div>
    </div>
  );
};

export default ButtonSearch;
