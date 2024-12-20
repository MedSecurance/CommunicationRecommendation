// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDBadge from "components/MDBadge";

// export default function data() {
//   const Device = ({ name }) => (
//     <MDBox display="flex" lineHeight={1}>
//       <MDBox ml={1} lineHeight={1}>
//         <MDTypography display="block" variant="button" fontWeight="medium">
//           {name}
//         </MDTypography>
//       </MDBox>
//     </MDBox>
//   );

//   const Job = ({ title, description }) => (
//     <MDBox lineHeight={1} textAlign="left">
//       <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
//         {title}
//       </MDTypography>
//       <MDTypography variant="caption">{description}</MDTypography>
//     </MDBox>
//   );

//   return {
//     columns: [
//       { Header: "author", accessor: "author", align: "left" },
//       { Header: "function", accessor: "function", align: "left" },
//       { Header: "status", accessor: "status", align: "left" },
//       { Header: "employed", accessor: "employed", align: "left" },
//       { Header: "action", accessor: "action", align: "left" },
//     ],

//     rows: [
//       {
//         author: <Author name="John Michael" />,
//         function: <Job title="Manager" description="Organization" />,
//         status: (
//           <MDBox ml={-1}>
//             <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
//           </MDBox>
//         ),
//         employed: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             23/04/18
//           </MDTypography>
//         ),
//         action: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             Edit
//           </MDTypography>
//         ),
//       },
//       {
//         author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
//         function: <Job title="Programator" description="Developer" />,
//         status: (
//           <MDBox ml={-1}>
//             <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
//           </MDBox>
//         ),
//         employed: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             11/01/19
//           </MDTypography>
//         ),
//         action: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             Edit
//           </MDTypography>
//         ),
//       },
//       {
//         author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
//         function: <Job title="Executive" description="Projects" />,
//         status: (
//           <MDBox ml={-1}>
//             <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
//           </MDBox>
//         ),
//         employed: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             19/09/17
//           </MDTypography>
//         ),
//         action: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             Edit
//           </MDTypography>
//         ),
//       },
//       {
//         author: <Author image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
//         function: <Job title="Programator" description="Developer" />,
//         status: (
//           <MDBox ml={-1}>
//             <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
//           </MDBox>
//         ),
//         employed: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             24/12/08
//           </MDTypography>
//         ),
//         action: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             Edit
//           </MDTypography>
//         ),
//       },
//       {
//         author: <Author image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
//         function: <Job title="Manager" description="Executive" />,
//         status: (
//           <MDBox ml={-1}>
//             <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
//           </MDBox>
//         ),
//         employed: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             04/10/21
//           </MDTypography>
//         ),
//         action: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             Edit
//           </MDTypography>
//         ),
//       },
//       {
//         author: <Author image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
//         function: <Job title="Programator" description="Developer" />,
//         status: (
//           <MDBox ml={-1}>
//             <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
//           </MDBox>
//         ),
//         employed: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             14/09/20
//           </MDTypography>
//         ),
//         action: (
//           <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
//             Edit
//           </MDTypography>
//         ),
//       },
//     ],
//   };
// }
