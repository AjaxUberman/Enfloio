import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () =>
      await axios
        .get(
          "https://finnhub.io/api/v1/news?category=general&token=cpum5j1r01qhicnal2q0cpum5j1r01qhicnal2qg"
        )
        .then((res) => setNews(res.data));
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-10 h-full  justify-center items-center py-32 px-40">
      <h1 className="text-5xl uppercase font-bold text-orange-400">News</h1>
      {news &&
        news.slice(0, 20).map((item, index) => (
          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 1,
              },
            }}
            key={index}
            className="border rounded-md shadow-sm grid grid-cols-4"
          >
            <img
              src={item.image}
              className="p-2 rounded-xl shadow-xl object-cover col-span-1"
              alt="News"
            />
            <div className=" flex flex-col gap-2 text-main-text col-span-3 p-4">
              <h1 className=" font-bold text-xl">{item.headline}</h1>
              <p className="text-secondary-text">{item.summary}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold"
              >
                Read More...
              </a>
            </div>
          </motion.div>
        ))}
    </div>
  );
};

export default News;
