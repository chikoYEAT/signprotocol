const Documentation = () => {
    return(
        <>
        <div className="bg-black text-white min-h-screen p-8" style={{paddingTop:'80px'}}>
            {/* Header */}
            <header className="border-b border-gray-800 pb-4 mb-8">
                <h1 className="text-4xl font-bold text-purple-500">Documentation</h1>
                <p className="text-gray-400 mt-2">Comprehensive guide to using and developing with this project and descriptive overview on api usage.</p>
            </header>

            {/* Introduction Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Introduction</h2>
                <p className="text-gray-300 leading-relaxed">
                    Welcome to the project documentation od blockmosaic. This guide will help you understand the setup process,
                    features, and structure of the project. The following sections
                    will provide all the information you need to get started.
                    <br />
                    Include multi-level approval workflows that align with the college’s administrative processes. Admin have access for approval of sign protocols from his own dashboard he/she can manage which protocol to be accepted and signed. The system aims to implement a robust on-chain verification mechanism for both work orders and certificates by leveraging the Sign Protocol. This ensures transparency and immutability of document verification on the blockchain. Additionally, the solution will incorporate a decentralized auction system, seamlessly integrated with Avail’s peer-to-peer (P2P) network, to facilitate secure and efficient procurement processes. The use of Avail’s P2P technology enhances data availability and security, making the procurement system more reliable and tamper-resistant. To maintain the integrity and security of the system, a robust role-based access control (RBAC) framework will be implemented. This ensures that only individuals with the appropriate permissions can perform specific actions within the system. Authorized personnel, based on their designated roles (e.g., admin or user), will have controlled access to key functionalities. For instance, only users with the correct privileges will be able to create new work orders, approve pending requests, or view detailed information related to work orders and ongoing auctions. This approach guarantees that sensitive operations and data remain secure and are only accessible by those with explicit authorization, thereby preventing unauthorized access and ensuring compliance with organizational policies.
                </p>
            </section>

            {/* Getting Started Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Getting Started</h2>
                <p className="text-gray-300 leading-relaxed">
                    To start using this project, clone the repository and install the necessary dependencies. Follow the steps below:
                </p>
                <pre className="bg-gray-900 text-purple-200 p-4 mt-4 rounded-md shadow-lg overflow-auto">
<code>
# Clone the repository
<br />
git clone https://github.com/chikoYEAT/signprotocol.git
</code>
<br />
<code>
# Navigate to the project folder
<br/>
cd signprotocol
</code>
<br />
<code>
# Install dependencies
<br />
npm install
</code>
<br />
<code>
# Navigate to the frontend folder
<br />
cd frontend
<br />
# Install dependencies
<br />
npm install
<br />
# Start the development server
<br />
node ./frontend/backend/server.js
<br />
npm run dev
</code>
                </pre>
            </section>
            {/* Features Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Features</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Authentication system with JWT and OAuth support</li>
                    <li>On-Chain Verification with Sign Protocol</li>
                    <li>Real-time data fetching and updates</li>
                    <li>User-friendly, responsive UI</li>
                    <li>Dark mode support out of the box</li>
                    <li>Certificate Issuance and Verification</li>
                    <li>Role-based access control for admin and user roles</li>
                </ul>
            </section>

            {/* Code Snippet Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">API Code Snippet</h2>
                <p className="text-gray-300 leading-relaxed">
                    Here's a sample of how you can implement a feature using our API:
                </p>
                <p className="text-gray-300 leading-relaxed">
                    User Auth
                </p>
                <pre className="bg-gray-900 text-purple-200 p-4 mt-4 rounded-md shadow-lg overflow-auto">
                <code>
                # API LOGIN
                <br />
                http://localhost:5000/api/auth/login
                </code>
                <br />
                <code>
                # API REGISTER
                <br/>
                http://localhost:5000/api/auth/login
                </code>
                </pre>
                <br/>
                <p className="text-gray-300 leading-relaxed">
                    Work Order Routes
                </p>
                <pre className="bg-gray-900 text-purple-200 p-4 mt-4 rounded-md shadow-lg overflow-auto">
                    <code>
                        http://localhost:5000/api/work-orders
                    </code>
                </pre>
                <br />
                <p className="text-gray-300 leading-relaxed">
                   Login/register json body consists of username, password and role type. Role type is the way by which user and Admin can be distinguished.
                </p>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 pt-4 mt-8">
                <p className="text-gray-500 text-sm">
                     {new Date().getFullYear()} blockmosaic . A Sign Protocol.
                </p>
            </footer>
        </div>
        </>
    )
}

export default Documentation;