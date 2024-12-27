import { logoutAdmin } from "@/redux/slices/authSlice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  IdCard,
  LockKeyholeIcon,
  LogOutIcon,
  MenuIcon,
  UserCircle,
  UserRound,
} from "lucide-react";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGetAccountQuery } from "@/redux/rktQueries/accounts";
import { RootState } from "@/redux/slices";

const userNavigation = [
  { name: "Profile", navigate: "/profile", icon: UserCircle },
  {
    name: "Change Password",
    navigate: "/changePassword",
    icon: LockKeyholeIcon,
  },
  { name: "Logout", navigate: "#", icon: LogOutIcon },
];

interface Props {
  setSidebarOpen: any;
  children: any;
}

const Header: FC<Props> = ({ setSidebarOpen, children }) => {
  const dispatch = useDispatch();

  const { data: userData } = useGetAccountQuery();

  const userName = (userData && userData[0]?.name) || "Loading ";
  const userId = (userData && userData[0]?._id) || "Loading...";

  const adminName = useSelector((state: RootState) => state.auth.admin?.name);

  return (
    <div className="lg:pl-72">
      <div className="sticky top-0 z-40 flex h-[64.5px] shrink-0 items-center gap-x-4  bg-[#111827] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon />
        </button>
        <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />
        <div className="flex flex-1 gap-x-4 self-stretch justify-end bg-[#111827] lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <UserRound className="h-9 w-9 rounded-full bg-gray-50 text-black" />
                <span className="text-white -mt-1 hidden lg:block">
                  <span className="lg:flex lg:items-center">
                    <span
                      aria-hidden="true"
                      className="ml-3 text-sm font-semibold leading-6"
                    >
                      {adminName || "loading"}
                      <span className="text-gray-400 text-xs flex items-start ml-3 -mt-1">
                        Admin
                      </span>
                    </span>

                    <ChevronDownIcon className="ml-2 h-5 w-5" />
                  </span>
                </span>
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 w-[192px] origin-top-right rounded bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none"
              >
                <div
                  className="flex items-center px-3 py-1 text-sm leading-6 hover:bg-primary text-gray-900 cursor-pointer"
                  title={`UserName: ${userName} | ID: ${userId}`}
                >
                  <IdCard className="h-6 w-5 rounded-full  text-gray-900" />

                  <span className="text-black text-xs ml-2 gap-2">
                    {userName?.slice(0, 8)}...: {userId?.slice(0, 8)}...
                  </span>
                </div>

                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    <Link
                      onClick={() =>
                        item.name === "Logout" && dispatch(logoutAdmin())
                      }
                      to={item.navigate}
                      className="px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-primary hover:text-black flex flex-row gap-2"
                    >
                      <item.icon size={18} />
                      {item.name}
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
      <main className="py-2 ">
        <div className="px-2 sm:px-2 lg:px-4">{children}</div>
      </main>
    </div>
  );
};

export default Header;
