"use client";
import Sidebar from "./components/Sidebar";
import { useState, useEffect } from "react";
import Image from "next/image";
import vegetable from "../../image/icon/vegetable.png";
import fruit from "../../image/icon/fruit.png";
import topping from "../../image/icon/topping.png";
import protein from "../../image/icon/protein.png";
import dressing from "../../image/icon/dressing.png";
import Swal from "sweetalert2";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<any[]>([]);
  const [filteredItems, setFilterItems] = useState<any[]>([]);
  const [sumCal, setSumCal] = useState<number>(0);
  const [countItems, setCountItems] = useState<number>(0);
  const [selectedIngredients, setSelectedIngredients] = useState<{
    [key: string]: number;
  }>({});
  const [handleIngredient, setHandleIngredient] = useState<any[]>([]);

  const incrementQuantity = (items: any) => {
    const filter = handleIngredient.filter(
      (el) => el.ingredient === items.ingredient
    );
    if (filter.length === 1) {
      setHandleIngredient([
        ...handleIngredient.filter((el) => el.ingredient !== items.ingredient),
        { ...filter[0], amount: filter[0].amount + 1 },
      ]);
    } else {
      setHandleIngredient((prevState) => [
        ...prevState,
        { ...items, amount: 1 },
      ]);
    }

    setSelectedIngredients((prevState) => ({
      ...prevState,
      [items.ingredient]: (prevState[items.ingredient] || 0) + 1,
    }));

    setCountItems(countItems + 1);
    setSumCal(sumCal + items.calories);
  };

  const decrementQuantity = (items: any) => {
    const filter = handleIngredient.filter(
      (el) => el.ingredient === items.ingredient
    );
    if (filter.length === 1) {
      setHandleIngredient([
        ...handleIngredient.filter((el) => el.ingredient !== items.ingredient),
        { ...filter[0], amount: filter[0].amount - 1 },
      ]);
    }

    setSelectedIngredients((prevState) => ({
      ...prevState,
      [items.ingredient]: Math.max((prevState[items.ingredient] || 0) - 1, 0),
    }));

    setSumCal(sumCal - items.calories);
    setCountItems(countItems - 1);
  };

  useEffect(() => {
    filterItems();
  }, [selectedCategory]);

  const filterZeroValues = (obj: any) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== 0)
    );
  };

  const postRecipe = async (recipeName: string) => {
    const filteredIngredients = filterZeroValues(selectedIngredients);
    const filterItems = handleIngredient.filter((el) => el.amount > 0);
    const data = {
      name: recipeName,
      totalCalories: sumCal,
      items: filterItems,
      counter: filteredIngredients,
    };
    const response = await fetch("http://localhost:3000/api/recipe", {
      headers: { Accept: "applicaiton/json" },
      method: "POST",
      body: JSON.stringify(data),
    });

    const res = await response.json();

    res.massage
      ? Swal.fire({
          icon: "error",
          title: "This Recipe Name Already Exists!",
        })
      : Swal.fire({ icon: "success", title: "Create Success!" });
  };

  const handleRecipe = () => {
    Swal.fire({
      title: "Recipe Name",
      input: "text",
      inputPlaceholder: "Input your Recipe Name....",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "rgb(34 197 94)",
      confirmButtonText: "Create New Recipe",
      preConfirm: async (value) => {
        !value && Swal.showValidationMessage("Please Input Recipe Name");
      },
    }).then((result) => {
      if (result.isConfirmed) {
        postRecipe(result.value);
      }
    });
  };

  const filterItems = async () => {
    const res = await fetch("http://localhost:3000/api/ingredients");
    const items: any[] = await res.json();
    if (selectedCategory.length > 0) {
      const tempItems = selectedCategory.map((e) => {
        const temp = items.filter((items) => items.category === e);
        return temp;
      });

      setFilterItems(tempItems.flat());
    } else {
      setFilterItems([...items]);
    }
  };

  const handleCategoryFilter = (name: string) => {
    if (selectedCategory.includes(name)) {
      const filters = selectedCategory.filter((e) => e !== name);
      setSelectedCategory(filters);
    } else {
      setSelectedCategory([...selectedCategory, name]);
    }
  };

  const categories = [
    { name: "vegetable", label: "Vegetables", image: vegetable },
    { name: "fruit", label: "Fruit", image: fruit },
    { name: "toppings", label: "Toppings", image: topping },
    { name: "protein", label: "Protein", image: protein },
    { name: "dressing", label: "Dressing", image: dressing },
  ];
  return (
    <div className="flex">
      <Sidebar path={"home"} />

      {/* header part */}
      <div className="p-5 w-full bg-gray-100">
        <h1 className="text-2xl md:text-4xl font-bold ">
          Let's Create... your own salad!!!
        </h1>
        <div className="bg-gradient-to-r from-amber-200 to-yellow-400 rounded-lg  mt-4">
          <div className="p-6">
            <p className="font-bold text-2xl mt-1">Fresh & </p>
            <p className="font-bold text-2xl ">tasty salads</p>
            <p className="text-md text-gray-500 mt-2">
              Relax please, we've got you
            </p>
            <p className="text-md text-gray-500">
              covered every day of the week
            </p>
          </div>
        </div>
        {/* ------------------ */}

        {/* categories part */}
        <div className="text-2xl pt-6 font-bold mb-4">Select Categories</div>
        <div className="flex mb-6">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`px-4 py-2 w-2/12 mx-2 w-2/ ${
                selectedCategory.includes(category.name)
                  ? "bg-yellow-200"
                  : "bg-white"
              }  rounded-full bg-white`}
              onClick={() => handleCategoryFilter(category.name)}
            >
              <div className={`flex w-full justify-center items-center`}>
                <Image
                  src={category.image}
                  alt="My Image"
                  width={50}
                  height={50}
                />
              </div>

              <p className="text-gray-500 pt-2">{category.label}</p>
            </button>
          ))}
        </div>
        {/* ------------------ */}

        {/* ingredient part */}
        <div className="text-2xl pt-6 font-bold mb-4">
          Choose your ingredient to make a salad
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-2">
            {filteredItems.map((item) => (
              <div
                key={item.ingredient}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
              >
                <div className="border rounded-lg shadow-md h-72 p-4 relative bg-white">
                  <div className="flex h-full flex-col ">
                    <div className="flex items-center justify-center">
                      <img
                        src={item.image}
                        alt="Ingredient"
                        className="w-full h-36 object-cover"
                      />
                    </div>

                    <h2 className="mt-2 item-left text-lg pt-2">
                      {item.ingredient}
                    </h2>
                    <div className="flex">
                      <p className="font-bold pr-1">{item.calories}</p>
                      <p className="text-yellow-400 font-bold">Cal</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-20">
                    {selectedIngredients[item.ingredient] > 0 && (
                      <button
                        onClick={() => decrementQuantity(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-full"
                      >
                        -
                      </button>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => incrementQuantity(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-full"
                    >
                      +
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-14">
                    {selectedIngredients[item.ingredient] > 0 && (
                      <span className="text-gray-700 font-bold">
                        {selectedIngredients[item.ingredient]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ------------------ */}

        {/* footer part */}
        {countItems > 0 ? (
          <div className="bottom-0 w-full bg-yellow-500 flex justify-between items-center p-4 shadow-lg">
            <div className="flex items-center">
              <span className="bg-white text-yellow-500 rounded-full h-8 w-8 flex items-center justify-center font-bold mr-2">
                {countItems}
              </span>
              <span className="text-white text-lg">Your Ingredients</span>
            </div>
            <div className="text-white text-lg">{sumCal} Cal</div>
            <button
              onClick={() => handleRecipe()}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              Create Recipe
            </button>
          </div>
        ) : null}

        {/* ------------------ */}
      </div>
    </div>
  );
}
