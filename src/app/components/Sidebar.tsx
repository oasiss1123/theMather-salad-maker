import { FC } from "react";
import Link from "next/link";
import { useState } from "react";
import { BookOutlined, HomeOutlined } from "@ant-design/icons";

const Sidebar = (path: any) => {
  return (
    <div className="bg-white w-64 min-h-screen shadow-md p-4">
      <h2 className="text-2xl font-bold mb-4">SALADMAKER</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/">
              <p
                className={`  ${
                  path.path === "home" ? "text-yellow-500" : ""
                } hover:text-yellow-600 font-semibold block py-2 px-4 rounded transition duration-200`}
              >
                {<HomeOutlined className="pr-2" />} Salad maker
              </p>
            </Link>
          </li>
          <li>
            <Link href="/recipe">
              <p
                className={`  ${
                  path.path === "recipe" ? "text-yellow-500" : ""
                } hover:text-yellow-600 font-semibold block py-2 px-4 rounded transition duration-200`}
              >
                {<BookOutlined className="pr-3" />}Recipe
              </p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
