import React from 'react'
import { FaUser } from "react-icons/fa";

export default function Contact({title, phone, email, name, icon}) {
  return (
    <div className="card card-compact w-full bg-base-100 shadow-xl">
      <figure>
        {icon}
      </figure>
      <div className="card-body">
        <h2 className="card-title pl-3">{name}</h2>
        <p className="text-left pl-3">{title}</p>
        <div className="divider">Contact Info</div>
        <p className="text-left pl-3">Phone: {phone}</p>
        <p className="text-left pl-3">Email: {email}</p>
      </div>
    </div>
  );
}

Contact.defaultProps = {
  title: "ACO Title",
  phone: "Not Listed",
  email: "Not Listed",
  name: "First Name",
  icon: <FaUser className="my-5 text-9xl" />,
};
