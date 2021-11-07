import React from "react";
import './style.css'

const Tabs = ({ color, tabs = [], children, ...props }) => {
    const [openTab, setOpenTab] = React.useState(0);

    return (
        <>
            <div className="flex flex-wrap mb-16">
                <div className="w-full tabs tabs-style-flip">
                    <nav>
                        <ul
                            className={``}
                            role="tablist"
                        >
                            {tabs.map((e, index) => {
                                return (<li className={`${openTab === index ? "tab-current" : ""}`}>
                                    <a
                                        className={
                                            ""
                                        }
                                        onClick={e => {
                                            e.preventDefault();
                                            setOpenTab(index);
                                        }}
                                        data-toggle="tab"
                                        href="#link1"
                                        role="tablist"
                                    >
                                        <span className="text-3xl font-medium">{e}</span>
                                    </a>
                                </li>);
                            })}


                        </ul>
                    </nav>
                </div>
            </div>
            {children[openTab]}

        </>
    );
};

export default Tabs;