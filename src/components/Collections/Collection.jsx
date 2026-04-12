import React from "react";
import "./Collection.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import collection1 from "../../assets/images/collection1.webp";
import collection2 from "../../assets/images/collection2.webp";
import collection3 from "../../assets/images/collection3.webp";
import collection4 from "../../assets/images/collection4.webp";

const Collection = () => {
  const collections = [
    {
      image: collection1,
      title: "10 Must-Visit Places for Christmas",
      places: 9,
      gradient: "linear-gradient(135deg, rgba(226, 55, 68, 0.8) 0%, rgba(255, 107, 107, 0.8) 100%)"
    },
    {
      image: collection2,
      title: "7 Finest Buffet Places",
      places: 7,
      gradient: "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)"
    },
    {
      image: collection3,
      title: "Top 8 Picturesque Cafes",
      places: 7,
      gradient: "linear-gradient(135deg, rgba(240, 147, 251, 0.8) 0%, rgba(245, 87, 108, 0.8) 100%)"
    },
    {
      image: collection4,
      title: "10 Best Luxury Dining Places",
      places: 10,
      gradient: "linear-gradient(135deg, rgba(79, 172, 254, 0.8) 0%, rgba(0, 242, 254, 0.8) 100%)"
    }
  ];

  return (
    <div className="collection">
      <div className="collection-header">
        <div className="header-content">
          <h1>Collections</h1>
          <div className="header-subtitle">
            <p>Explore curated lists of top restaurants, cafes, pubs, and bars in Ahmedabad, based on trends</p>
            <span className="view-all">
              All collection in Ahmedabad <ArrowRightIcon className="arrow" />
            </span>
          </div>
        </div>
      </div>
      <div className="collectionCard">
        {collections.map((collection, index) => (
          <div className="collectionImg" key={collection.title}>
            <div className="image-container">
              <img src={collection.image} alt={collection.title} />
              <div className="overlay" style={{ background: collection.gradient }}></div>
            </div>
            <div className="content">
              <h3>{collection.title}</h3>
              <span>
                {collection.places} Places <ArrowRightIcon className="arrow-small" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
