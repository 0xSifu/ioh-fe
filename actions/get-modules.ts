import e from "express";

const staticModules = [
  {
    name: "home",
    enabled: true,
    position: 1,
  },
  {
    name: "follows",
    enabled: true,
    position: 2,
  },
  {
    name: "stories",
    enabled: true,
    position: 3
  },
  {
    name: "friends",
    enabled: true,
    position: 4
  }
];

export const getModules = async () => {
  return staticModules;
};