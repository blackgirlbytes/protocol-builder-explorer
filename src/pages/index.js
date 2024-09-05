import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [protocolName, setProtocolName] = useState('');
  const [published, setPublished] = useState(true);
  const [types, setTypes] = useState([{ name: '', schema: '', dataFormats: '' }]);
  const [structure, setStructure] = useState([{ name: '', actions: [{ who: 'anyone', can: ['create', 'update'] }] }]);
  const [jsonOutput, setJsonOutput] = useState('{}');
  const [copySuccess, setCopySuccess] = useState('');

  const availableActions = [
    'co-delete', 'co-prune', 'co-update', 'create', 'delete',
    'prune', 'query', 'read', 'subscribe', 'update'
  ];

  useEffect(() => {
    const protocolSchema = {
      protocol: protocolName || "https://example.com/your-protocol",
      published: published,
      types: types.reduce((acc, type) => {
        if (type.name && type.schema) {
          acc[type.name] = {
            schema: type.schema,
            dataFormats: type.dataFormats.split(',').map(format => format.trim()),
          };
        }
        return acc;
      }, {}),
      structure: structure.reduce((acc, struct) => {
        if (struct.name) {
          acc[struct.name] = {
            $actions: struct.actions.map(action => ({
              who: action.who,
              can: action.can,
            })),
          };
        }
        return acc;
      }, {}),
    };
    setJsonOutput(JSON.stringify(protocolSchema, null, 2));
  }, [protocolName, published, types, structure]);

  const handleAddType = () => setTypes([...types, { name: '', schema: '', dataFormats: '' }]);
  const handleAddStructure = () => setStructure([...structure, { name: '', actions: [{ who: 'anyone', can: ['create', 'update'] }] }]);

  const handleTypeChange = (index, field, value) => {
    const newTypes = [...types];
    newTypes[index][field] = value;
    setTypes(newTypes);
  };

  const handleStructureChange = (index, field, value) => {
    const newStructure = [...structure];
    newStructure[index][field] = value;
    setStructure(newStructure);
  };

  const handleActionChange = (structureIndex, actionIndex, field, value) => {
    const newStructure = [...structure];
    newStructure[structureIndex].actions[actionIndex][field] = value;
    setStructure(newStructure);
  };

  const handleAddAction = (structureIndex) => {
    const newStructure = [...structure];
    newStructure[structureIndex].actions.push({ who: 'anyone', can: ['create', 'update'] });
    setStructure(newStructure);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div style={styles.container}>
    <nav style={styles.navbar}>
      <Link href="/" style={styles.navLink}>
        Home
      </Link>
      <Link href="/explorer" style={styles.navLink}>
        Protocol Explorer
      </Link>
    </nav>

      <h1 style={styles.header}>Web5 Protocol Schema Builder</h1>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Protocol URL:</label>
        <input
          style={styles.input}
          type="text"
          value={protocolName}
          onChange={(e) => setProtocolName(e.target.value)}
          placeholder="https://example.com/your-protocol"
          required
        />
      </div>

      <div style={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>
      </div>

      <h2 style={styles.subHeader}>Types</h2>
      {types.map((type, index) => (
        <div key={index} style={styles.typeBlock}>
          <input
            style={styles.input}
            type="text"
            placeholder="Type Name"
            value={type.name}
            onChange={(e) => handleTypeChange(index, 'name', e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Schema URL"
            value={type.schema}
            onChange={(e) => handleTypeChange(index, 'schema', e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Data Formats (comma-separated)"
            value={type.dataFormats}
            onChange={(e) => handleTypeChange(index, 'dataFormats', e.target.value)}
            required
          />
        </div>
      ))}
      <button style={styles.button} type="button" onClick={handleAddType}>Add Type</button>

      <h2 style={styles.subHeader}>Structure</h2>
      {structure.map((struct, structIndex) => (
        <div key={structIndex} style={styles.structureBlock}>
          <input
            style={styles.input}
            type="text"
            placeholder="Structure Name"
            value={struct.name}
            onChange={(e) => handleStructureChange(structIndex, 'name', e.target.value)}
            required
          />
          <h3>Actions</h3>
          {struct.actions.map((action, actionIndex) => (
            <div key={actionIndex} style={styles.actionBlock}>
              <select
                style={styles.select}
                value={action.who}
                onChange={(e) => handleActionChange(structIndex, actionIndex, 'who', e.target.value)}
              >
                <option value="anyone">Anyone</option>
                <option value="author">Author</option>
                <option value="recipient">Recipient</option>
              </select>
              <select
                multiple
                style={styles.select}
                value={action.can}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  handleActionChange(structIndex, actionIndex, 'can', selected);
                }}
              >
                {availableActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          ))}
          <button style={styles.button} type="button" onClick={() => handleAddAction(structIndex)}>Add Action</button>
        </div>
      ))}
      <button style={styles.button} type="button" onClick={handleAddStructure}>Add Structure</button>

      <h2 style={styles.subHeader}>Generated JSON</h2>
      <pre style={styles.jsonOutput}>{jsonOutput}</pre>

      <button style={styles.button} onClick={handleCopyToClipboard}>Copy JSON</button>
      {copySuccess && <span style={styles.copySuccess}>{copySuccess}</span>}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
  },
  navbar: {
    marginBottom: '20px',
    backgroundColor: '#007bff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '5px 10px',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  subHeader: {
    fontSize: '20px',
    marginTop: '20px',
    marginBottom: '10px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  checkboxGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
  typeBlock: {
    paddingBottom: '10px',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
  },
  structureBlock: {
    paddingBottom: '10px',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  actionBlock: {
    marginBottom: '10px',
  },
  jsonOutput: {
    background: '#f4f4f4',
    padding: '10px',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap',
    fontSize: '14px',
    marginTop: '10px',
  },
  copySuccess: {
    color: 'green',
    marginLeft: '10px',
  },
};




// import Link from 'next/link';

// export default function Welcome() {
//   return (
//     <div>
//       <h1>Welcome to the Web5 Protocol Builder</h1>
//       <p>Let's get started building your protocol.</p>
//       <Link href="/published">
//         <button>Next</button>
//       </Link>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';

// export default function Home() {
//   const [protocolName, setProtocolName] = useState('');
//   const [published, setPublished] = useState(true);
//   const [types, setTypes] = useState([]);
//   const [structure, setStructure] = useState([]);
//   const [roles, setRoles] = useState(['anyone', 'author', 'recipient']);
//   const [newRole, setNewRole] = useState('');
//   const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);
//   const [jsonOutput, setJsonOutput] = useState('{}');
//   const [copySuccess, setCopySuccess] = useState('');

//   const availableActions = [
//     'co-delete',
//     'co-prune',
//     'co-update',
//     'create',
//     'delete',
//     'prune',
//     'query',
//     'read',
//     'subscribe',
//     'update'
//   ];

//   useEffect(() => {
//     const buildStructure = (struct, parent = '') => {
//       const structureObj = {};

//       if (struct.actions && struct.actions.length > 0) {
//         structureObj.$actions = struct.actions.map((action) => {
//           const actionObj = {};

//           // Handle default roles (author, recipient) with "who" and "of"
//           if (['author', 'recipient'].includes(action.who)) {
//             actionObj.who = action.who;
//             actionObj.of = action.of || parent; // Use selected context or default to parent
//           } else if (action.role) {
//             // Handle custom roles, no "of" needed
//             actionObj.role = parent ? `${parent}/${action.role.split('/').pop()}` : action.role;
//           } else if (action.who) {
//             // Handle "anyone" or other cases where "who" is directly specified
//             actionObj.who = action.who;
//           }

//           actionObj.can = action.can;
//           return actionObj;
//         });
//       }

//       if (struct.nested && struct.nested.length > 0) {
//         struct.nested.forEach((nestedStruct) => {
//           structureObj[nestedStruct.name] = buildStructure(nestedStruct, parent ? `${parent}/${struct.name}` : struct.name);
//         });
//       }

//       return structureObj;
//     };

//     const roleStructures = structure.filter((struct) => roles.includes(struct.name)).reduce((acc, struct) => {
//       acc[struct.name] = { $role: true };
//       return acc;
//     }, {});

//     const mainStructures = structure.filter((struct) => !roles.includes(struct.name)).reduce((acc, struct) => {
//       acc[struct.name] = buildStructure(struct);
//       return acc;
//     }, {});

//     const protocolSchema = {
//       protocol: protocolName || 'https://example.com/your-protocol',
//       published: published,
//       types: types.reduce((acc, type) => {
//         if (type.name && type.schema) {
//           acc[type.name] = {
//             schema: type.schema,
//             dataFormats: type.dataFormats.split(',').map((format) => format.trim()),
//           };
//         }
//         return acc;
//       }, {}),
//       structure: {
//         ...roleStructures,
//         ...mainStructures
//       },
//     };

//     setJsonOutput(JSON.stringify(protocolSchema, null, 2));
//   }, [protocolName, published, types, structure]);

//   const handleAddType = () => {
//     const newType = { name: '', schema: '', dataFormats: '' };
//     setTypes([...types, newType]);
//     setStructure([...structure, { name: '', actions: [], nested: [] }]);
//   };

//   const handleRemoveType = (index) => {
//     const newTypes = types.filter((_, i) => i !== index);
//     const newStructure = structure.filter((_, i) => i !== index);
//     setTypes(newTypes);
//     setStructure(newStructure);
//   };

//   const handleTypeChange = (index, field, value) => {
//     const newTypes = [...types];
//     newTypes[index][field] = value;
//     setTypes(newTypes);

//     if (field === 'name') {
//       const newStructure = [...structure];
//       newStructure[index].name = value;
//       setStructure(newStructure);
//     }
//   };

//   const handleActionChange = (structureIndex, actionIndex, field, value, nestedIndex = null) => {
//     const newStructure = [...structure];
//     if (nestedIndex === null) {
//       newStructure[structureIndex].actions[actionIndex][field] = value;
//     } else {
//       newStructure[structureIndex].nested[nestedIndex].actions[actionIndex][field] = value;
//     }
//     setStructure(newStructure);
//   };

//   const handleAddAction = (structureIndex, nestedIndex = null) => {
//     const newStructure = [...structure];
//     if (nestedIndex === null) {
//       if (!newStructure[structureIndex].actions) {
//         newStructure[structureIndex].actions = [];
//       }
//       newStructure[structureIndex].actions.push({ who: 'anyone', can: ['create', 'update'] });
//     } else {
//       if (!newStructure[structureIndex].nested[nestedIndex].actions) {
//         newStructure[structureIndex].nested[nestedIndex].actions = [];
//       }
//       newStructure[structureIndex].nested[nestedIndex].actions.push({ who: 'anyone', can: ['create', 'update'] });
//     }
//     setStructure(newStructure);
//   };

//   const handleRemoveAction = (structureIndex, actionIndex, nestedIndex = null) => {
//     const newStructure = [...structure];
//     if (nestedIndex === null) {
//       newStructure[structureIndex].actions = newStructure[structureIndex].actions.filter((_, i) => i !== actionIndex);
//     } else {
//       newStructure[structureIndex].nested[nestedIndex].actions = newStructure[structureIndex].nested[nestedIndex].actions.filter((_, i) => i !== actionIndex);
//     }
//     setStructure(newStructure);
//   };

//   const handleRemoveNestedAction = (structureIndex, nestedIndex, actionIndex) => {
//     const newStructure = [...structure];
//     newStructure[structureIndex].nested[nestedIndex].actions = newStructure[structureIndex].nested[nestedIndex].actions.filter((_, i) => i !== actionIndex);
//     setStructure(newStructure);
//   };

//   const handleAddNestedStructure = (structureIndex) => {
//     const newStructure = [...structure];
//     if (!newStructure[structureIndex].nested) {
//       newStructure[structureIndex].nested = [];
//     }
//     newStructure[structureIndex].nested.push({ name: '', actions: [], nested: [] });
//     setStructure(newStructure);
//   };

//   const handleRemoveNestedStructure = (structureIndex, nestedIndex) => {
//     const newStructure = [...structure];
//     newStructure[structureIndex].nested = newStructure[structureIndex].nested.filter((_, i) => i !== nestedIndex);
//     setStructure(newStructure);
//   };

//   const handleNestedStructureChange = (structureIndex, nestedIndex, field, value) => {
//     const newStructure = [...structure];
//     newStructure[structureIndex].nested[nestedIndex][field] = value;
//     setStructure(newStructure);
//   };

//   const handleAddNestedAction = (structureIndex, nestedIndex) => {
//     const newStructure = [...structure];
//     if (!newStructure[structureIndex].nested[nestedIndex].actions) {
//       newStructure[structureIndex].nested[nestedIndex].actions = [];
//     }
//     newStructure[structureIndex].nested[nestedIndex].actions.push({ who: 'anyone', can: ['create', 'update'] });
//     setStructure(newStructure);
//   };

//   const handleRoleChange = (structureIndex, actionIndex, nestedIndex, value, parentContext) => {
//     const newStructure = [...structure];
//     if (nestedIndex === null) {
//       // If we're dealing with the main structure
//       if (['author', 'recipient'].includes(value)) {
//         newStructure[structureIndex].actions[actionIndex].who = value;
//         newStructure[structureIndex].actions[actionIndex].role = ''; // Clear the role if it was set
//         newStructure[structureIndex].actions[actionIndex].of = parentContext; // Set default "of" context
//         setShowCustomRoleInput(false); // Hide custom role input if showing
//       } else if (value === 'customRole') {
//         // Show the input box for custom role entry
//         setShowCustomRoleInput(true);
//       } else {
//         newStructure[structureIndex].actions[actionIndex].role = value;
//         newStructure[structureIndex].actions[actionIndex].who = ''; // Clear the who if it was set
//         newStructure[structureIndex].actions[actionIndex].of = ''; // Clear the of field
//         setShowCustomRoleInput(false); // Hide custom role input if showing
//       }
//     } else {
//       // If we're dealing with a nested structure
//       if (['author', 'recipient'].includes(value)) {
//         newStructure[structureIndex].nested[nestedIndex].actions[actionIndex].who = value;
//         newStructure[structureIndex].nested[nestedIndex].actions[actionIndex].role = ''; // Clear the role if it was set
//         newStructure[structureIndex].nested[nestedIndex].actions[actionIndex].of = parentContext; // Set default "of" context
//         setShowCustomRoleInput(false); // Hide custom role input if showing
//       } else if (value === 'customRole') {
//         // Show the input box for custom role entry
//         setShowCustomRoleInput(true);
//       } else {
//         newStructure[structureIndex].nested[nestedIndex].actions[actionIndex].role = value;
//         newStructure[structureIndex].nested[nestedIndex].actions[actionIndex].who = ''; // Clear the who if it was set
//         newStructure[structureIndex].nested[nestedIndex].actions[actionIndex].of = ''; // Clear the of field
//         setShowCustomRoleInput(false); // Hide custom role input if showing
//       }
//     }
//     setStructure(newStructure);
//   };

//   const handleOfContextChange = (structureIndex, actionIndex, nestedIndex, value) => {
//     const newStructure = [...structure];
//     if (nestedIndex === null) {
//       newStructure[structureIndex].actions[actionIndex].of = value;
//     } else {
//       newStructure[structureIndex].nested[nestedIndex].actions[actionIndex].of = value;
//     }
//     setStructure(newStructure);
//   };

//   const handleAddRole = () => {
//     if (newRole && !roles.includes(newRole)) {
//       setRoles([...roles, newRole]);
//       setTypes([
//         ...types,
//         {
//           name: newRole,
//           schema: `https://example.com/schema/${newRole.toLowerCase()}`,
//           dataFormats: 'text/plain',
//         },
//       ]);
//       setStructure([...structure, { name: newRole, actions: [], nested: [] }]);
//       setNewRole(''); // Clear the input field
//       setShowCustomRoleInput(false); // Hide the custom role input field
//     }
//   };

//   const handleCopyToClipboard = () => {
//     navigator.clipboard.writeText(jsonOutput).then(() => {
//       setCopySuccess('Copied to clipboard!');
//       setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
//     });
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Web5 Protocol Schema Builder</h1>

//       <div>
//         <label>Protocol URL:</label>
//         <input
//           type="text"
//           value={protocolName}
//           onChange={(e) => setProtocolName(e.target.value)}
//           placeholder="https://example.com/your-protocol"
//           required
//         />
//       </div>

//       <div>
//         <label>
//           <input
//             type="checkbox"
//             checked={published}
//             onChange={(e) => setPublished(e.target.checked)}
//           />
//           Published
//         </label>
//       </div>

//       <h2>Types</h2>
//       {types.map((type, index) => (
//         <div key={index} style={{ marginBottom: '10px' }}>
//           <input
//             type="text"
//             placeholder="Type Name"
//             value={type.name}
//             onChange={(e) => handleTypeChange(index, 'name', e.target.value)}
//             required
//           />
//           <input
//             type="text"
//             placeholder="Schema URL"
//             value={type.schema}
//             onChange={(e) => handleTypeChange(index, 'schema', e.target.value)}
//             required
//           />
//           <input
//             type="text"
//             placeholder="Data Formats (comma-separated)"
//             value={type.dataFormats}
//             onChange={(e) => handleTypeChange(index, 'dataFormats', e.target.value)}
//             required
//           />
//           <button type="button" onClick={() => handleRemoveType(index)}>Remove Type</button>
//         </div>
//       ))}
//       <button type="button" onClick={handleAddType}>Add Type</button>

//       <h2>Structure</h2>
//       {structure.map((struct, structIndex) => (
//         <div key={structIndex} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
//           <input
//             type="text"
//             placeholder="Structure Name"
//             value={struct.name}
//             onChange={(e) => handleTypeChange(structIndex, 'name', e.target.value)}
//             required
//           />
//           <h3>Actions</h3>
//           {struct.actions && struct.actions.map((action, actionIndex) => (
//             <div key={actionIndex} style={{ marginBottom: '10px' }}>
//               <select
//                 value={action.role || action.who}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   const parentContext = struct.name; // Set parent context to current structure name
//                   handleRoleChange(structIndex, actionIndex, null, value, parentContext);
//                 }}
//               >
//                 {roles.map((role) => (
//                   <option key={role} value={role}>
//                     {role}
//                   </option>
//                 ))}
//                 <option value="customRole">Custom Role...</option>
//               </select>

//               {/* Show the "of" context dropdown if author or recipient is selected */}
//               {(['author', 'recipient'].includes(action.who)) && (
//                 <select
//                   value={action.of}
//                   onChange={(e) => handleOfContextChange(structIndex, actionIndex, null, e.target.value)}
//                 >
//                   <option value={struct.name}>{struct.name}</option>
//                   {struct.nested && struct.nested.map((nested) => (
//                     <option key={nested.name} value={`${struct.name}/${nested.name}`}>
//                       {`${struct.name}/${nested.name}`}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               {/* Show custom role input if the custom role option was selected */}
//               {showCustomRoleInput && action.role === '' && (
//                 <input
//                   type="text"
//                   value={newRole}
//                   placeholder="Enter custom role name"
//                   onChange={(e) => setNewRole(e.target.value)}
//                   onBlur={handleAddRole}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       handleAddRole();
//                     }
//                   }}
//                   style={{ marginLeft: '10px' }}
//                 />
//               )}

//               <select
//                 multiple
//                 value={action.can}
//                 onChange={(e) => {
//                   const selected = Array.from(e.target.selectedOptions, (option) => option.value);
//                   handleActionChange(structIndex, actionIndex, 'can', selected);
//                 }}
//               >
//                 {availableActions.map((action) => (
//                   <option key={action} value={action}>
//                     {action}
//                   </option>
//                 ))}
//               </select>
//               <button type="button" onClick={() => handleRemoveAction(structIndex, actionIndex)}>Remove Action</button>
//             </div>
//           ))}
//           <button type="button" onClick={() => handleAddAction(structIndex)}>Add Action</button>

//           <h3>Nested Structures</h3>
//           {struct.nested && struct.nested.map((nestedStruct, nestedIndex) => (
//             <div key={nestedIndex} style={{ marginBottom: '10px', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
//               <input
//                 type="text"
//                 placeholder="Nested Structure Name"
//                 value={nestedStruct.name}
//                 onChange={(e) => handleNestedStructureChange(structIndex, nestedIndex, 'name', e.target.value)}
//                 required
//               />
//               <h4>Actions</h4>
//               {nestedStruct.actions && nestedStruct.actions.map((action, actionIndex) => (
//                 <div key={actionIndex} style={{ marginBottom: '10px' }}>
//                   <select
//                     value={action.role || action.who}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       const parentContext = `${struct.name}/${nestedStruct.name}`; // Set parent context to current nested structure name
//                       handleRoleChange(structIndex, actionIndex, nestedIndex, value, parentContext);
//                     }}
//                   >
//                     {roles.map((role) => (
//                       <option key={role} value={role}>
//                         {role}
//                       </option>
//                     ))}
//                     <option value="customRole">Custom Role...</option>
//                   </select>

//                   {/* Show the "of" context dropdown if author or recipient is selected */}
//                   {(['author', 'recipient'].includes(action.who)) && (
//                     <select
//                       value={action.of}
//                       onChange={(e) => handleOfContextChange(structIndex, actionIndex, nestedIndex, e.target.value)}
//                     >
//                       <option value={nestedStruct.name}>{nestedStruct.name}</option>
//                       <option value={`${struct.name}`}>{`${struct.name}`}</option>
//                       <option value={`${struct.name}/${nestedStruct.name}`}>{`${struct.name}/${nestedStruct.name}`}</option>
//                     </select>
//                   )}

//                   {/* Show custom role input if the custom role option was selected */}
//                   {showCustomRoleInput && action.role === '' && (
//                     <input
//                       type="text"
//                       value={newRole}
//                       placeholder="Enter custom role name"
//                       onChange={(e) => setNewRole(e.target.value)}
//                       onBlur={handleAddRole}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') {
//                           handleAddRole();
//                         }
//                       }}
//                       style={{ marginLeft: '10px' }}
//                     />
//                   )}

//                   <select
//                     multiple
//                     value={action.can}
//                     onChange={(e) => {
//                       const selected = Array.from(e.target.selectedOptions, (option) => option.value);
//                       handleActionChange(structIndex, actionIndex, 'can', selected, nestedIndex);
//                     }}
//                   >
//                     {availableActions.map((action) => (
//                       <option key={action} value={action}>
//                         {action}
//                       </option>
//                     ))}
//                   </select>
//                   <button type="button" onClick={() => handleRemoveNestedAction(structIndex, nestedIndex, actionIndex)}>Remove Action</button>
//                 </div>
//               ))}
//               <button type="button" onClick={() => handleAddNestedAction(structIndex, nestedIndex)}>Add Nested Action</button>
//               <button type="button" onClick={() => handleRemoveNestedStructure(structIndex, nestedIndex)}>Remove Nested Structure</button>
//             </div>
//           ))}
//           <button type="button" onClick={() => handleAddNestedStructure(structIndex)}>Add Nested Structure</button>
//         </div>
//       ))}

//       <h2 style={{ marginTop: '20px' }}>Generated JSON</h2>
//       <pre style={{ background: '#f4f4f4', padding: '10px', whiteSpace: 'pre-wrap' }}>{jsonOutput}</pre>

//       <button onClick={handleCopyToClipboard} style={{ marginTop: '10px' }}>
//         Copy JSON
//       </button>
//       {copySuccess && <span style={{ marginLeft: '10px', color: 'green' }}>{copySuccess}</span>}
//     </div>
//   );
// }
