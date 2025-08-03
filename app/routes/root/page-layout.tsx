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

        <div className="auth">
            <section className="size-full glassmorphism flex-center px-6">
           <div className="sign-in-card">
            <ButtonComponent
                type="button"
                className="button-class !h-11 !w-full flex items-center gap-2"
                onClick={() => navigate('/dashboard')}
            >
                <img
                    src="/assets/icons/dashboard.png"
                    className="size-5"
                    alt="go dashboard"
                />
                <span className="p-18-semibold text-white">Go to the Dashboard</span>
            </ButtonComponent>
           </div>
            </section>
        </div>
    )
}
export default PageLayout
