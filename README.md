# ConsortiumGreenBond: A Comprehensive Green Bond Management System

**ConsortiumGreenBond** is a cutting-edge system designed specifically for the meticulous management of green bonds. At its core, it harnesses the robust capabilities of the **HyperLedger Fabric** Framework.

#### Ensuring Detailed Fund Movement

In the intricate world of green bond management, it's crucial:
- To have a comprehensive grasp over the detailed movements of all funds associated with a bond.
- To guarantee that these funds are always readily accessible.
- Every single transaction that takes place with the funds within a bond must be meticulously scrutinized. A determination must be made regarding whether the transaction can be classified as 'green' or 'non-green'.

#### Addressing Traditional Challenges

Traditional mechanisms of managing green bonds have been plagued by:
- Prohibitive labor costs.
- Extended verification processes.
- A lack of effective traceability of fund movements.

#### The Blockchain Advantage

**ConsortiumGreenBond** brings a paradigm shift by incorporating the distinct advantages of blockchain technology. By housing all the pertinent green bond information on a consortium blockchain (specifically, Hyperledger Fabric), the system...


## Software Architecture


The following is a class diagram drawn based on the above object description and action description:

![VLF1Rjim3BtxAuoUjWufjcjFJHiK2D1qNPBjpbYS8zIcCeaw6CF-VPQbCb8Tz6JncNfyVAJk78DbttTLrNJWNFrW-XFGKF-jwdhn5Zr3ZrFyg0ceqT3j6DYxc6DHQHRWIxt5LZksmDhGfyyJjARVnlOvykX9QMhZjH7xzoPWsJJ64vS2fdFwys0Kvl7t4z8AE66UZyPg7gJ8JuSvVO0ITpY6pYGGvXT_wBGx2ki6s0TI0KBs](https://github.com/Anotherlynn/ConsortiumGreenBond/assets/74956197/456904af-30ad-4612-8b8a-ef87fee7641b)


## Object Model (Static Model)

**Object Description:**
While the use case diagram provides detailed attributes and services for entity classes such as enterprises, supervisors, and administrators, the following descriptions focus on other classes and objects.

1. **Object 1: User (User Class)**
- **Purpose:** Serves as an abstract class representing all system users, used for user information management.
- **Constraints:** Each user is uniquely identified by a UserCode, and the class allows for polymorphic inheritance with the possibility of multiple instances of specialized classes.
- **Persistence:** Objects of this class are persistent.

2. **Object 2: Bond (Bond Class)**
- **Purpose:** Encapsulates information related to individual bonds.
- **Constraints:** Multiple bond instances are allowed, but each bond instance must have a unique BondCode, and its attributes must also be unique.
- **Persistence:** Objects of this class are persistent.

3. **Object 3: Review Task (ReviewTasks Class)**
- **Purpose:** Manages the evaluation and review tasks associated with bond information.
- **Constraints:** Each review task is uniquely identified by a Code and is assigned to audit a specific bond from a company. Task execution is limited to supervisor accounts, and audit data submission is performed through enterprise accounts.
- **Durability:** Tasks persist from the initiation of the application until the completion of the review process.

4. **Object 4: Account (Account Class)**
- **Purpose:** Records fund usage status.
- **Constraints:** Only bonds that have undergone review and approval can become account objects. Each qualified bond from a company corresponds to an account object in the Account class.
- **Persistence:** Account objects are generated upon successful review.

5. **Object 5: Database (Database Class)**
- **Purpose:** Ensures data synchronization across all nodes in the blockchain network.
- **Constraints:** Identity must be one of supervisor, administrator, or enterprise node. Each blockchain node possesses a unique IP address, which must adhere to a specific format.
- **Persistence:** Database objects are persistent.



**Action Description**

(1) AccountAction

| name       | describe                      |
|------------|-------------------------------|
| `fundUse()`| Upload fund usage information |

(2) BondManagement

| name               | describe                   |
|--------------------|----------------------------|
| `AddBond()`       | add bond                   |
| `auditRequest()`  | Submit review request      |
| `bondInfo()`      | Submit bond information    |
| `auditReport()`   | Download audit report      |

- CompanyAction

| name             | describe                    |
|------------------|-----------------------------|
| `Registration()` | Register an account         |
| `information()`  | Upload information          |
| `BondInfoStats()`| Cumulative bond information |

(3) UserAction

| name               | describe               |
|--------------------|------------------------|
| `LoginAccount()`   | login system           |
| `SearchBondInfo()` | Query bond information |
| `SearchDetail1()`  | Query details          |

(4) AdministratorAction

| name               | describe               |
|--------------------|------------------------|
| `SearchBondInfo()` | Query bond information |
| `SearchUserInfo()` | Query user information |

(5) AuditAction

| name               | describe               |
|--------------------|------------------------|
| `U_fineReport()`   | Upload Successful bond report |

(6) InfoManagementAction

| name               | describe               |
|--------------------|------------------------|
| `InfoMaintenance()`   | Maintain user and bond information (CRUD) |

![RP71IWCn48RlUOfXporz0wbjMgIibqPFriEOpDR09YcPwOg8x-uGb89jJl-GV-Rx9rcoO9Lp6irGCH5qUveYVG3c03JXU4Q99SDfH1bAJHqWmtO3NmRqQ6SSq0jq3q-F_MA74pfVuqaMQ-SwystCnM5H42QgSOY-pPmTCaZ5p2aoQzsGBANYaHfcrLzXxaEOmIP4cO6baOGE-G9jG5_IgMJAQkQaZU1BLegNnI6lpXmpCKEF](https://github.com/Anotherlynn/ConsortiumGreenBond/assets/74956197/b96f7d06-95ba-468d-b6ba-6359e67299a3)

The system predominantly follows the conventional B/S (Browser/Server) architectural model for its design and development. A salient aspect to emphasize is the need for a smart contract layer. This layer bridges the business logic, which encompasses data verification, transmission, and storage, with the database. The implementation of this smart contract layer will be realized through smart contract code and represents a critical and challenging aspect of the project.

More specifically:

**User Layer**: The UI (User Interface) will be constructed using the Element framework, leveraging HTML to define the page layout. Operational logic within the page will be scripted using JavaScript.

**Business Logic Layer**: Business operations will be crafted in JavaScript to define the requisite business logic.

**Smart Contract Layer**: We will utilize the JavaScript SDK provided officially by the Hyperledger Fabric project. This will be essential in defining the logic for database operations.

By adopting JavaScript across these three (arguably four) layers, we maintain a unified programming language approach. This consistency not only simplifies the development process but also alleviates potential challenges in future development and implementation phases.

#### Installation

1.  xxxx
2.  xxxx
3.  xxxx

#### Instructions

1.  xxxx
2.  xxxx
3.  xxxx

#### Contribution

1.  Fork the repository
2.  Create Feat_xxx branch
3.  Commit your code
4.  Create Pull Request


#### Gitee Feature

1.  You can use Readme\_XXX.md to support different languages, such as Readme\_en.md, Readme\_zh.md
2.  Gitee blog [blog.gitee.com](https://blog.gitee.com)
3.  Explore open source project [https://gitee.com/explore](https://gitee.com/explore)
4.  The most valuable open source project [GVP](https://gitee.com/gvp)
5.  The manual of Gitee [https://gitee.com/help](https://gitee.com/help)
6.  The most popular members  [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
