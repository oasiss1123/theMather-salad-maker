"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Empty, Button } from "antd";
import Swal from "sweetalert2";
import Link from "next/link";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";

const Recipe = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  useEffect(() => {
    getRecipe();
  }, []);

  const getRecipe = async () => {
    const res = await fetch("http://localhost:3000/api/recipe");
    const items: any[] = await res.json();

    setRecipes(items);
  };

  const deleteReecipe = async (id: number) => {
    const response = await fetch("http://localhost:3000/api/recipe", {
      headers: { Accept: "applicaiton/json" },
      method: "DELETE",
      body: JSON.stringify({ id: id }),
    });

    getRecipe();
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure to delete this recipe?",

      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: "",
      confirmButtonColor: "red",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReecipe(id);
      }
    });
  };

  return (
    <div className="flex">
      <Sidebar path={"recipe"} />

      <div className="p-5 w-full bg-gray-100">
        <h1 className="text-2xl md:text-4xl font-bold ">Recipe</h1>
        <div className="bg-white w-full rounded-lg shadow-lg p-6 mt-6">
          <div className="font-bold">Your Recipe</div>
          {recipes.length < 1 ? (
            <Empty />
          ) : (
            <div className="flex flex-wrap -mx-4">
              {recipes.map((recipe, index) => (
                <div
                  key={index}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4"
                >
                  <div className="bg-gradient-to-r from-amber-400 to-green-600 h-64 rounded-lg shadow-lg p-6 relative">
                    <div className="bg-white rounded-lg shadow-lg p-3 relative">
                      <h2 className="text-xl font-semibold mb-2 break-words">
                        {recipe.name}
                      </h2>
                      <div className="flex">
                        <p className="text-2xl font-bold pr-2">
                          {recipe.totalCalories}
                        </p>
                        <p className="text-2xl text-yellow-600 font-bold">
                          Cal
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-2 flex justify-center w-full">
                      <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(recipe.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg mr-2"
                      >
                        Delete
                      </Button>
                      <Link href={`/recipe/${recipe.id}`}>
                        <Button
                          type={"text"}
                          icon={<FormOutlined />}
                          className="bg-gray-700 text-white px-3 py-1 rounded-lg"
                        >
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipe;
