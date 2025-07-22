import {Link} from "react-router";
import {SidebarComponent} from "@syncfusion/ej2-react-navigations";
import NavItems from "./NavItems";
import {useRef} from "react";


const MobileSidebar = () => {
    let sidebar = useRef<SidebarComponent | null>(null);

    const toggleSidebar = () => {
        sidebar.current?.toggle();
    }

    return (
        <div className="mobile-sidebar wrapper">
            <header>
                <Link to="/">
                    <img
                        src="/assets/icons/logo.svg"
                        alt="Logo"
                        className="size-[30px]"
                    />
                    <h1>Travelisto</h1>
                </Link>

                 {/*//@ts-ignore*/}
                <button onClick={toggleSidebar}>
                    <img src="/assets/icons/menu.svg" alt="menu"
                     className="size-7 cursor-pointer"
                    />
                </button>
            </header>

            <SidebarComponent
                width={270}
                ref={(e) => {
                    sidebar.current = e;
                }}
                created={() => {
                    sidebar.current?.hide();
                }}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type="over"

            >
                <NavItems handleClick={toggleSidebar} />

            </SidebarComponent>


        </div>
    )
}
export default MobileSidebar
