import React from "react";
import { FaUser } from "react-icons/fa";

export default function Contact({ title, phone, email, name, icon, CopyButton }) {
  return (
    <div className="card card-compact w-full bg-base-100 shadow-xl">
      <figure>{icon}</figure>
      <div className="card-body">
        <h2 className="card-title pl-3">{name || "Not Listed"}</h2>
        <p className="text-left pl-3">{title || "ACO Title"}</p>
        <div className="divider">Contact Info</div>
        <p className="text-left pl-3 flex items-center">
          Phone: {phone || "Not Listed"}
          {CopyButton && phone && phone !== "Not Listed" && (
            <CopyButton text={phone} label={`${title}-phone`} />
          )}
        </p>
        <p className="text-left pl-3 flex items-center flex-wrap">
          Email: {email || "Not Listed"}
          {CopyButton && email && email !== "Not Listed" && (
            <CopyButton text={email} label={`${title}-email`} />
          )}
        </p>
      </div>
    </div>
  );
}

Contact.defaultProps = {
  title: "ACO Title",
  phone: "Not Listed",
  email: "Not Listed",
  name: "Not Listed",
  icon: <FaUser className="my-5 text-7xl" />,
};
