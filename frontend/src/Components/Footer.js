export const Footer = () => {
    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            textAlign: "center",
            padding: "5px",    
            backgroundColor: "#504b4b",
            color: "#fff",
            fontSize: "14px", 
            height: "50px",   
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h4 style={{ margin: 0 }}>
                © 2025 NotizenMaster. All rights reserved.
            </h4>
        </div>
    );
};

export default Footer;
