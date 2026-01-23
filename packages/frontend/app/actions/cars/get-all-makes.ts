import { cars, db } from 'database';

export async function getAllMakes() {
  const makes = await db.selectDistinct({ make: cars.make }).from(cars);
  const makesArray = makes.map((make) => make.make);
  return makesArray;
}
