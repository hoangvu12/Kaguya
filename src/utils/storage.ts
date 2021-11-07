class Storage {
  storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  clear() {
    localStorage.clear();
  }

  remove(filter: object) {
    const rawList = localStorage.getItem(this?.storageKey);

    if (!rawList) return;

    const list: object[] = JSON.parse(rawList);

    // Filter out the item we wanna remove
    localStorage.setItem(
      this?.storageKey,
      JSON.stringify(list.filter((item) => !compareTwoObject(item, filter)))
    );
  }

  create(value: object) {
    const rawList = localStorage.getItem(this?.storageKey);

    if (!rawList) {
      return localStorage.setItem(
        this?.storageKey,
        JSON.stringify([value]) // Save value in array
      );
    }

    const list = JSON.parse(rawList);

    list.push(value);

    localStorage.setItem(this?.storageKey, JSON.stringify(list));
  }

  findOne<T extends {}>(filter = {}): T | undefined {
    const rawList = localStorage.getItem(this?.storageKey);

    if (!rawList) return undefined;

    const parsedList: T[] = JSON.parse(rawList);

    if (isObjectEmpty(filter)) {
      return parsedList[0];
    }

    return parsedList.find((item) => compareTwoObject(item, filter));
  }

  find<T>(filter = {}): T[] {
    const rawList = localStorage.getItem(this?.storageKey);

    if (!rawList) return [];

    const parsedList: T[] = JSON.parse(rawList);

    if (isObjectEmpty(filter)) {
      return parsedList;
    }

    return parsedList.filter((item) => compareTwoObject(item, filter));
  }

  update(filter: object, value: object) {
    this.remove(filter);

    const item = this.findOne(filter);

    const updatedItem = { ...item, ...value };

    return this.create(updatedItem);
  }

  has(filter: object) {
    const item = this.findOne(filter);

    if (!item) return false;

    return !isObjectEmpty(item);
  }
}

const isObjectEmpty = (obj: object) => JSON.stringify(obj) === "{}";

// check if object one contains all property and value of object two.
const compareTwoObject = <T, U extends keyof T>(obj1: T, obj2: T) => {
  let isComparedCount = 0;

  const entries = Object.entries(obj2);

  for (const [key, value] of entries) {
    if (obj1[key as U] === value) {
      isComparedCount++;
    }
  }

  return isComparedCount === entries.length;
};

export default Storage;
