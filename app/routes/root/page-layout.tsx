import {useNavigate} from "react-router";
import {loginWithGoogle, logoutUser} from "~/appwrite/auth";
import {ButtonComponent} from "@syncfusion/ej2-react-buttons";

const PageLayout = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in');
    }

    return (
        <div className="auth flex flex-col">

            <ButtonComponent
                type="button"
                iconCss="e-search-icon"
                className="button-class !h-11 !w-full"
                onClick={() => {navigate('/dashboard')}}
            >

                <img
                    src="/assets/icons/dashboard.png"
                    className="size-5"
                    alt="go dashboard"
                />
                <span className="p-18-semibold text-white">Go to the Dashboard</span>

            </ButtonComponent>
        </div>
    )
}
export default PageLayout
