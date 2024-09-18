import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { GiMedicalPackAlt } from "react-icons/gi";
import { IoMdAnalytics } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";

const SideBar = () => {
	const location = useLocation();
	const menus = [
		{name: "Exames", link: "/solicitacao-de-exames", icon: GiMedicalPackAlt},
		{name: "Cirurgias", link: "/solicitacao-de-cirurgias", icon: GiMedicalPackAlt},
		{name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard ,margin:true},
		{name: "Analytics", link: "/analytics", icon: IoMdAnalytics},
		{name: "Usuario", link: "/users", icon: FaRegUser ,margin:true},
		{name: "Configurações", link: "/settings", icon: IoSettingsSharp},
		{name: "Sair", link: "/login", icon: IoLogOutOutline,margin:true}
	];

	const [open, setOpen] = useState(false);
	
	return(
		<section>
			<div className={`bg-[#0056b3] min-h-screen ${open ? 'w-52': 'w-16'} duration-500 text-gray-100 px-3`}>
				<div className="py-3 flex justify-end items-center gap-5">
					<h2 className={`whitespace-pre duration-500 ${!open && `opacity-0 hidden`} font-bold`} style={{ fontSize: '1.5em' }}>
						MedFlow
					</h2>				
					{open ? (
						<IoCloseSharp size={26} className="cursor-pointer" onClick={()=>setOpen(!open)}/>
					) : (
						<HiMenuAlt3 size={26} className="cursor-pointer" onClick={()=>setOpen(!open)}/>
					)}
				</div>

				<div className="mt-4 flex flex-col gap-4 relative">
					{menus.map((menu, index) => (
						<Link 
							to={menu.link} 
							key={index} 
							className={`${menu?.margin && 'mt-8'} group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-white hover:text-[#0056b3] rounded-md ${location.pathname === menu.link ? 'bg-white text-[#0056b3]' : ''}`}
						>
							<div>{React.createElement(menu.icon, {size: "20"})}</div>
							<h2 
								className={`whitespace-pre duration-200 ${!open && `opacity-0 translate-x-28 overflow-hidden`} group-hover:transition-none`}>
								{menu.name}
							</h2>
							<h2 className={`${open && "hidden"} absolute left-25 bg-[#0056b3] font-bold whitespace-pre text-white rounded-md drop-shadow-1g px-0 py-0  
							w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-16 group-hover:duration-300 group-hover:w-fit`}>
								{menu.name}
							</h2>
						</Link>
					))}					
				</div>
			</div>
		</section>
	)
};

export default SideBar;
