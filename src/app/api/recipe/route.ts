const recipeData: any[] = [];
let id: number = 1;

export async function GET(request: Request) {
  return Response.json(recipeData);
}

export async function POST(request: Request) {
  const data = await request.json();

  const filter = recipeData.filter((el) => el.name === data.name);

  if (filter.length > 0) {
    return Response.json({
      massage: "this recipe is already have",
    });
  } else {
    recipeData.push({ id: id, ...data });
    id++;
    return Response.json(recipeData);
  }
}

export async function DELETE(request: Request) {
  const data = await request.json();

  const filter = recipeData.filter((el) => el.id !== data.id);

  recipeData.length = 0;
  filter.map((e) => {
    recipeData.push(e);
  });

  return Response.json(recipeData);
}

export async function PATCH(request: Request) {
  const data = await request.json();

  const filter = recipeData.filter((el) => el.id !== data.id);

  recipeData.length = 0;
  filter.map((e) => {
    recipeData.push(e);
  });

  recipeData.push(data);

  return Response.json(recipeData);
}
