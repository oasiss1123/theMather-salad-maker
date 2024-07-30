"use client";
import Sidebar from "@/app/components/Sidebar";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

const EditRecipe = () => {
  const params = useParams<{ id: any }>();
  const [recipes, setRecipes] = useState<any>({});
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [sumCal, setSumCal] = useState<number>(0);
  const [selectedIngredients, setSelectedIngredients] = useState<{
    [key: string]: number;
  }>({});

  const getRecipe = async () => {
    const res = await fetch("http://localhost:3000/api/recipe");
    const items: any[] = await res.json();
    const filter = items.filter((el) => el.id === parseInt(params.id));

    setRecipes(filter[0]);
    setIngredients(filter[0].items);
    setSelectedIngredients(filter[0].counter);
    setSumCal(filter[0].totalCalories);
  };

  useEffect(() => {
    getRecipe();
  }, []);

  const incrementQuantity = (items: any) => {
    setSelectedIngredients((prevState) => ({
      ...prevState,
      [items.ingredient]: (prevState[items.ingredient] || 0) + 1,
    }));

    setSumCal(sumCal + items.calories);
  };

  const decrementQuantity = (items: any) => {
    setSelectedIngredients((prevState) => ({
      ...prevState,
      [items.ingredient]: Math.max((prevState[items.ingredient] || 0) - 1, 0),
    }));

    setSumCal(sumCal - items.calories);
  };

  const filterZeroValues = (obj: any) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== 0)
    );
  };

  const handleUpdate = async () => {
    const filteredIngredients = filterZeroValues(selectedIngredients);
    const data = {
      id: parseInt(params.id),
      name: recipes.name,
      totalCalories: sumCal,
      items: ingredients,
      counter: filteredIngredients,
    };
    const response = await fetch("http://localhost:3000/api/recipe", {
      headers: { Accept: "applicaiton/json" },
      method: "PATCH",
      body: JSON.stringify(data),
    });

    response.status === 200 &&
      Swal.fire({ icon: "success", title: "Update Success!" });
  };

  const handleDelete = (item: any) => {
    setSumCal(sumCal - item.calories * selectedIngredients[item.ingredient]);
    setSelectedIngredients((prevState) => ({
      ...prevState,
      [item.ingredient]: 0,
    }));
    const filter = ingredients.filter(
      (el) => el.ingredient !== item.ingredient
    );

    setIngredients(filter);
  };

  return (
    <div className="flex">
      <Sidebar path="recipe" />
      <div className="p-5 w-full bg-gray-100">
        <h1 className="text-2xl md:text-4xl font-bold ">Edit Recipe</h1>
        <div className="bg-white w-full rounded-lg shadow-lg p-6 mt-6">
          <div className="font-bold">
            Your Ingredient to make a salad recipe
          </div>
          <ul className="pt-4">
            {ingredients.map((data) => (
              <li key={data.ingredient} className="flex items-center mb-4">
                <img
                  src={data.image}
                  alt="Ingredient"
                  className="w-2/12 h-1/12 object-cover"
                />

                <div className="ml-4">
                  <p className="font-semibold">{data.ingredient}</p>
                  <div className="flex pt-2">
                    <div className="bottom-4 pr-4 right-20">
                      {selectedIngredients[data.ingredient] > 1 && (
                        <button
                          onClick={() => decrementQuantity(data)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded-full"
                        >
                          -
                        </button>
                      )}
                    </div>
                    <div className=" bottom-4 right-14">
                      {selectedIngredients[data.ingredient] > 0 && (
                        <span className="text-gray-700 font-bold">
                          {selectedIngredients[data.ingredient]}
                        </span>
                      )}
                    </div>
                    <div className="pl-4 bottom-4 right-4">
                      <button
                        onClick={() => incrementQuantity(data)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-full"
                      >
                        +
                      </button>
                    </div>
                    {ingredients.length < 2 ? null : (
                      <a
                        onClick={() => {
                          handleDelete(data);
                        }}
                        className="text-red-500 ml-2"
                      >
                        Delete
                      </a>
                    )}
                  </div>
                </div>
                <span className="ml-auto text-yellow-600">
                  +{data.calories * selectedIngredients[data.ingredient]} Cal
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t mt-4 pt-4 flex justify-between">
            <div>
              <p className="font-bold text-xl">Total Calorie</p>
            </div>
            <div className="flex">
              <p className="font-bold text-2xl pr-2">{sumCal}</p>
              <p className="text-yellow-600 font-bold text-2xl">Cal</p>
            </div>
          </div>
          <button
            onClick={() => handleUpdate()}
            className="w-full mt-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
          >
            Update Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
