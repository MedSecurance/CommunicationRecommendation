export const stepperJson = {
    
  protocols: [
    {
      
        Protocol : "wifi",
        Questions : [ 
        {
          Type : "Text",
          Name : "Description",
          Value : {value: "", isEnabled: true},
          Label : "Communication protocol description",
          Id : 1 ,
          IsHeading: false,
          IsMultiple : false,
          IsParent : false,
          ChildQuestons : []
        }, 
        {          
          Type : "Text",
          Name : "NetworkName",
          Value : {value: "", isEnabled: true},
          Label : "Network Name",
          Id : 2 ,
          IsHeading: false,
          IsMultiple : false,
          IsParent : false,
          ChildQuestons : []
        },
        {
          Type : "Boolean",
          Name : "FirewallEnabled",
          Value : {},
          Label : "Firewall Enabled",
          Id : 3 ,
          IsHeading: false,
          IsMultiple : false,
          IsParent : false,
          ChildQuestons : []
        },
        {
          Type : "Boolean",
          Name : "LogMonitoringEnabled",
          Value : {},
          Label : "Log Monitoring Enabled",
          Id : 4 ,
          IsHeading: false,
          IsMultiple : false,
          IsParent : false,
          ChildQuestons : []
        },
        {
          Type : "Text",
          Name : "IpRange",
          Value : {value: "", isEnabled: true},
          Label : "Ip Range",
          Id : 53,
          IsHeading: false,
          IsMultiple : false,
          IsParent : false,
          ChildQuestons : []
        },
        {
          Type : "Boolean",
          Name : "AlreadyImplemented",
          Value : {},
          Label : "Already Implemented",
          Id : 6 ,
          IsHeading: false,
          IsMultiple : false,
          IsParent : false,
          ChildQuestons : []
        },
        {
          Type : "Heading",
          Name : "NetworkDetails",
          Value : {},
          Label : "Network Details",
          Id : 7 ,
          IsHeading: true,
          IsMultiple : false,
          IsParent : true,
          ChildQuestons : [
          {
            Type : "Label",
            Name : "DeploymentDetails",
            Value : {},
            Label : "Deployment Details",
            Id : 8 ,
            IsHeading: false,
            IsMultiple : false,
            IsParent : true,
            ChildQuestons : [
            {           
              Type : "Multiple",
              Name : "AccessPoints",
              Value : {},
              Label : "Access Points",
              Id : 9 ,
              IsHeading: false,
              IsMultiple : true,
              IsParent : false,
              ChildQuestons : [
                {
                  Type : "Dropdown",
                  Name : "Standard",
                  DropDownValues : ["802.11a", "802.11b", "802.11g", "802.11n", "802.11ac", "802.11ax"],
                  IsDynamic : true,
                  Value : {},
                  Label : "Standard",
                  Id : 5,
                  IsHeading: false,
                  IsMultiple : false,
                  IsParent : false,
                  ChildQuestons : []             
              },
              {
                Type : "Text",
                Name : "AccessPointName",
                Value : {value: "", isEnabled: true},
                Label : "Access Point Name",
                Id : 90,
                IsHeading: false,
                IsMultiple : false,
                IsParent : false,
                ChildQuestons : []             
            },
            {
              Type : "Text",
              Name : "ssid",
              Value : {value: "", isEnabled: true},
              Label : "ssid",
              Id : 9098887,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []             
          },
          {
            Type : "Boolean",
            Name : "HiddenSsid",
            Value : {value: "", isEnabled: true},
            Label : "Hidden ssid",
            Id : 9098888,
            IsHeading: false,
            IsMultiple : false,
            IsParent : false,
            ChildQuestons : []             
         },
         {
          Type : "Text",
          Name : "Manufacturer",
          Value : {value: "", isEnabled: true},
          Label : "Manufacturer",
          Id : 9098889,
          IsHeading: false,
          IsMultiple : false,
          IsParent : false,
          ChildQuestons : []             
       },
       {
        Type : "Text",
        Name : "Model",
        Value : {value: "", isEnabled: true},
        Label : "Model",
        Id : 9098810,
        IsHeading: false,
        IsMultiple : false,
        IsParent : false,
        ChildQuestons : []             
     },
     {
      Type : "Dropdown",
      Name : "AntennaType",
      DropDownValues : ["omnidirectional", "directional", "batch", "yagi", "panel", "sector"],
      Value : {},
      Label : "Antenna type",
      Id : 9098812,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []             
   },
   {
    Type : "Integer",
    Name : "FirmwareUpdatedYear",
    Value : {},
    Label : "Firmware Updated Year",
    Id : 9098813,
    IsHeading: false,
    IsMultiple : false,
    IsParent : false,
    ChildQuestons : []             
 },
 {
  Type : "Dropdown",
  Name : "PhysicalLocation",
  DropDownValues : ["secure place", "open space", "private place"],
  Value : {},
  Label : "Physical Location",
  Id : 9098814,
  IsHeading: false,
  IsMultiple : false,
  IsParent : false,
  ChildQuestons : []             
}
            ] 
            },
            {
              Type : "Integer",
              Name : "AreaCoverageInMeters",
              Value : {},
              Label : "AreaCoverage In Meters",
              Id : 10 ,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []
            },
            {              
             Type : "Dropdown",
             Name : "LevelOfInterference",
             DropDownValues : ["low", "medium", "high"],
             Value : {},
             Label : "Level Of Interference",
             Id : 19,
             IsHeading: false,
             IsMultiple : false,
             IsParent : false,
             ChildQuestons : []             
            },
            {              
              Type : "Integer",
              Name : "LifetimeInYears",
              Value : {},
              Label : "Lifetime In Years",
              Id : 20,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []             
             },
             {              
              Type : "Integer",
              Name : "TypicalLatencyRTTInMs",
              Value : {},
              Label : "Typical Latency RTT In Ms",
              Id : 21,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []             
             },
             {              
              Type : "Dropdown",
              Name : "Placement",
              DropDownValues : ["premisses", "cloud", "hybrid"],
              Value : {},
              Label : "Placement",
              Id : 22,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []             
             },
             {              
              Type : "Integer",
              Name : "BandwidthInMbps",
              Value : {},
              Label : "Bandwidth in Mbps",
              Id : 23,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []             
             }
            ]
          },
          {
            Type : "Multiple",
            Name : "NetworkFailures",
            Value : {},
            Label : "Network Failures",
            Id : 321123 ,
            IsHeading: false,
            IsMultiple : true,
            IsParent : false,
            ChildQuestons : [{              
              Type : "Dropdown",
              Name : "CauseOfFailure",
              DropDownValues : ["hardware issue", "interference", "overload", "software/firmware", "power", "environment", "configuration error"],
              Value : {},
              Label : "Cause Of Failure",
              Id : 232112342,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []             
             },]
          },
          {
            Type : "Label",
            Name : "IomtDetails",
            Value : {},
            Label : "IoMT Details",
            Id : 234 ,
            IsHeading: false,
            IsMultiple : false,
            IsParent : true,
            ChildQuestons : [
              {
                Type : "Integer",
                Name : "NumberOfSensors",
                Value : {},
                Label : "Number Of Sensors",
                Id : 34 ,
                IsHeading: false,
                IsMultiple : false,
                IsParent : false,
                ChildQuestons : []
              },
              {
                Type : "Integer",
                Name : "NumberOfConnectedDevices",
                Value : {},
                Label : "Number Of Connected Devices",
                Id : 35 ,
                IsHeading: false,
                IsMultiple : false,
                IsParent : false,
                ChildQuestons : []
              },
              {
                Type : "Integer",
                Name : "NumberOfActuators",
                Value : {},
                Label : "Number of actuators",
                Id : 36 ,
                IsHeading: false,
                IsMultiple : false,
                IsParent : false,
                ChildQuestons : []
              },
            ]
          }
      ] 
        },
        {
          Type : "Dropdown",
          Name : "Attacks",
          DropDownValues : ["MitM", "Dos", "Eavesdropping", "Unauthorized Access", "Network Jamming"],
          Value : {},
          Label : "Attacks",
          Id : 8953321,
          IsHeading: false,
          IsMultiple : false,
          IsParent : false,
          ChildQuestons : []             
      }

      ]
    },
    {
      
      Protocol : "bluetooth",
      Questions : [ 
      {          
        Type : "Text",
        Name : "NetworkName",
        Value : {value: "", isEnabled: true},
        Label : "Network Name",
        Id : 2 ,
        IsHeading: false,
        IsMultiple : false,
        IsParent : false,
        ChildQuestons : []
      },
      {
        Type : "Boolean",
        Name : "FirewallEnabled",
        Value : {},
        Label : "Firewall Enabled",
        Id : 3 ,
        IsHeading: false,
        IsMultiple : false,
        IsParent : false,
        ChildQuestons : []
      },
      {
        Type : "Boolean",
        Name : "LogMonitoringEnabled",
        Value : {},
        Label : "Log Monitoring Enabled",
        Id : 4 ,
        IsHeading: false,
        IsMultiple : false,
        IsParent : false,
        ChildQuestons : []
      },
      {
        Type : "Text",
        Name : "IpRange",
        Value : {value: "", isEnabled: true},
        Label : "Ip Range",
        Id : 502,
        IsHeading: false,
        IsMultiple : false,
        IsParent : false,
        ChildQuestons : []
      },
      {
        Type : "Boolean",
        Name : "AlreadyImplemented",
        Value : {},
        Label : "Already Implemented",
        Id : 6 ,
        IsHeading: false,
        IsMultiple : false,
        IsParent : false,
        ChildQuestons : []
      },
      {
        Type : "Heading",
        Name : "NetworkDetails",
        Value : {},
        Label : "Network Details",
        Id : 7 ,
        IsHeading: true,
        IsMultiple : false,
        IsParent : true,
        ChildQuestons : [
        {
          Type : "Label",
          Name : "DeploymentDetails",
          Value : {},
          Label : "Deployment Details",
          Id : 8 ,
          IsHeading: false,
          IsMultiple : false,
          IsParent : true,
          ChildQuestons : [
          {           
            Type : "Multiple",
            Name : "AccessPoints",
            Value : {},
            Label : "Access Points",
            Id : 9 ,
            IsHeading: false,
            IsMultiple : true,
            IsParent : false,
            ChildQuestons : [
              {
                Type : "Dropdown",
                Name : "Standard",
                DropDownValues : ["802.11", "802.11a", "802.11b", "802.11g", "802.11n", "802.11ac", "802.11ax"],
                Value : {},
                Label : "Ip Range",
                Id : 895,
                IsHeading: false,
                IsMultiple : false,
                IsParent : false,
                ChildQuestons : []             
            },
            {
              Type : "Text",
              Name : "AccessPointName",
              Value : {value: "", isEnabled: true},
              Label : "Ip Range",
              Id : 599,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []             
          }
          ] 
          },
          {
            Type : "Integer",
            Name : "AreaCoverageInMeters",
            Value : {},
            Label : "AreaCoverage In Meters",
            Id : 10 ,
            IsHeading: false,
            IsMultiple : false,
            IsParent : false,
            ChildQuestons : []
          },
          {              
           Type : "Dropdown",
           Name : "LevelOfInterference",
           DropDownValues : ["low", "medium", "high"],
           Value : {},
           Label : "Level Of Interference",
           Id : 19,
           IsHeading: false,
           IsMultiple : false,
           IsParent : false,
           ChildQuestons : []             
          },
          {              
            Type : "Integer",
            Name : "LifetimeInYears",
            Value : {},
            Label : "Lifetime In Years",
            Id : 20,
            IsHeading: false,
            IsMultiple : false,
            IsParent : false,
            ChildQuestons : []             
           },
           {              
            Type : "Integer",
            Name : "TypicalLatencyRTTInMs",
            Value : {},
            Label : "Typical Latency RTT In Ms",
            Id : 21,
            IsHeading: false,
            IsMultiple : false,
            IsParent : false,
            ChildQuestons : []             
           },
           {              
            Type : "Dropdown",
            Name : "Placement",
            DropDownValues : ["premisses", "cloud", "hybrid"],
            Value : {},
            Label : "Placement",
            Id : 22,
            IsHeading: false,
            IsMultiple : false,
            IsParent : false,
            ChildQuestons : []             
           },
           {              
            Type : "Integer",
            Name : "BandwidthInMbps",
            Value : {},
            Label : "Bandwidth in Mbps",
            Id : 23,
            IsHeading: false,
            IsMultiple : false,
            IsParent : false,
            ChildQuestons : []             
           }
          ]
        },
        {
          Type : "Multiple",
          Name : "NetworkFailures",
          Value : {},
          Label : "Network Failures",
          Id : 9 ,
          IsHeading: false,
          IsMultiple : true,
          IsParent : false,
          ChildQuestons : [{
            Type : "Text",
            Name : "Test",
            Value : {value: "", isEnabled: true},
            Label : "Test Question",
            Id : 153234552,
            IsHeading: false,
            IsMultiple : false,
            IsParent : false,
            ChildQuestons : []
          },
          {
            Type : "Text",
            Name : "FailureHandling",
            Value : {value: "", isEnabled: true},
            Label : "Failure Handling",
            Id : 909881043223,
            IsHeading: false,
            IsMultiple : false,
            IsParent : false,
            ChildQuestons : []             
         }]
        },
        {
          Type : "Label",
          Name : "IomtDetails",
          Value : {},
          Label : "IoMT Details",
          Id : 234 ,
          IsHeading: false,
          IsMultiple : false,
          IsParent : true,
          ChildQuestons : [
            {
              Type : "Integer",
              Name : "NumberOfSensors",
              Value : {},
              Label : "Number Of Sensors",
              Id : 34 ,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []
            },
            {
              Type : "Integer",
              Name : "NumberOfConnectedDevices",
              Value : {},
              Label : "Number Of Connected Devices",
              Id : 35 ,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []
            },
            {
              Type : "Integer",
              Name : "NumberOfActuators",
              Value : {},
              Label : "Number of actuators",
              Id : 36 ,
              IsHeading: false,
              IsMultiple : false,
              IsParent : false,
              ChildQuestons : []
            },
          ]
        }
    ] 
      }
    ]
  }

]

}

export const wifiDynamicQuestions  = [ 
  {
    dropDownQuestionId: 5099,
    dropDownSelectedValue: "2.4 GHz",
    questions : [ 
    {
      Type : "Text",
      Name : "FrequencyType",
      Value : {value: "ISM bands", isEnabled: false},
      Label : "Frequency Type",
      selectedDepents : { dropDownValue:"2.4 GHz" , questionId : 5099 },
      Id : 98756456,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    }
  ]  
  },
  {
    dropDownQuestionId: 5099,
    dropDownSelectedValue: "5 GHz",
    questions : [ 
    {
      Type : "Text",
      Name : "FrequencyType",
      Value : {value: "U-NII bands", isEnabled: false},
      Label : "Frequency Type",
      selectedDepents : { dropDownValue:"5 GHz" , questionId : 5099 },
      Id : 98756456231,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    }
  ]  
  },
  {
    dropDownQuestionId: 5,
    dropDownSelectedValue: "802.11b",
    questions : [ {
      Type : "Text",
      Name : "OperationFrequencies",
      Value : { value: "2.4 GHz", isEnabled: false},
      Label : "Operation Frequencies",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 21234 ,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "FrequencyType",
      Value : {value: "ISM bands", isEnabled: false},
      Label : "Frequency Type",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 212345,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "ChannelBandwidth",
      Value : {value: "20 MHz", isEnabled: false},
      Label : "Channel Bandwidth",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 212346,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "DataRate",
      Value : {value: "0.1 Mbps - 11 Mbps", isEnabled: true},
      Label : "Data Rate",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 212347,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "NumberOfChannels",
      Value : {value: "1 - 24", isEnabled: true},
      Label : "Number of Channels",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 212348,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "Range",
      Value : {value: "25 m - 150 m", isEnabled: true},
      Label : "Range",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 212349,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "Gateway/IntermediateDevice",
      Value : {value: "Yes", isEnabled: true},
      Label : "Gateway/Intermediate device",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 2123410,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Dropdown",
      Name : "TopologyType",
      Value : {},
      DropDownValues : ["Star", "Single AP", "Mesh"],
      Label : "Topology Type",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 2123411,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "MinimumSignalSensitivity",
      Value : {value: "-85 dbm - -95 dBm", isEnabled: true},
      Label : "Minimum Signal Sensitivity",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 2123412,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "AveragePowerConsumption",
      Value : {value: "0.5 W", isEnabled: true},
      Label : "Average Power Consumption",
      selectedDepents : { dropDownValue:"802.11b" , questionId : 5 },
      Id : 2123413,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    }
  ]  
  },
  {
    dropDownQuestionId: 5,
    dropDownSelectedValue: "802.11a",
    questions : [ {
      Type : "Text",
      Name : "OperationFrequencies",
      Value : { value: "5 GHz", isEnabled: false},
      Label : "Operation Frequencies",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 1234 ,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "FrequencyType",
      Value : {value: "U-NII bands", isEnabled: false},
      Label : "Frequency Type",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 12345,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "ChannelBandwidth",
      Value : {value: "20 MHz", isEnabled: false},
      Label : "Channel Bandwidth",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 12346,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "DataRate",
      Value : {value: "0.1 Mbps - 54 Mbps", isEnabled: true},
      Label : "Data Rate",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 12347,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "NumberOfChannels",
      Value : {value: "1 - 24", isEnabled: true},
      Label : "Number of Channels",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 12348,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "Range",
      Value : {value: "25 m - 150 m", isEnabled: true},
      Label : "Range",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 12349,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "Gateway/IntermediateDevice",
      Value : {value: "Yes", isEnabled: true},
      Label : "Gateway/Intermediate device",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 123410,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Dropdown",
      Name : "TopologyType",
      Value : {},
      DropDownValues : ["Star", "Single AP", "Mesh"],
      Label : "Topology Type",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 123411,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "MinimumSignalSensitivity",
      Value : {value: "-85 dbm - -95 dBm", isEnabled: true},
      Label : "Minimum Signal Sensitivity",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 123412,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "AveragePowerConsumption",
      Value : {value: "0.5 W", isEnabled: true},
      Label : "Average Power Consumption",
      selectedDepents : { dropDownValue:"802.11a" , questionId : 5 },
      Id : 123412,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    }
  ] 
  },
  {
    dropDownQuestionId: 5,
    dropDownSelectedValue: "802.11n",
    questions : [ 
    {
      Type : "Dropdown",
      Name : "ChannelBandwidth",
      Value : {},
      DropDownValues : ["20 MHz", "40 MHz", "80 MHz"],
      Label : "ChannelBandwidth",
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Id : 1234132311,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "DataRate",
      Value : {value: "0.1 Mbps - 600 Mbps", isEnabled: true},
      Label : "Data Rate",
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Id : 12342127,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "NumberOfChannels",
      Value : {value: "1 - 24", isEnabled: true},
      Label : "Number of Channels",
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Id : 123443248,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "Range",
      Value : {value: "25 m - 150 m", isEnabled: true},
      Label : "Range",
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Id : 123345349,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "Gateway/IntermediateDevice",
      Value : {value: "Yes", isEnabled: true},
      Label : "Gateway/Intermediate device",
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Id : 1234143450,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Dropdown",
      Name : "TopologyType",
      Value : {},
      DropDownValues : ["Star", "Single AP", "Mesh"],
      Label : "Topology Type",
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Id : 123412341,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "MinimumSignalSensitivity",
      Value : {value: "-75 dbm - -85 dBm", isEnabled: true},
      Label : "Minimum Signal Sensitivity",
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Id : 12341232342,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Text",
      Name : "AveragePowerConsumption",
      Value : {value: "0.5 W", isEnabled: true},
      Label : "Average Power Consumption",
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Id : 1234223412,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []
    },
    {
      Type : "Dropdown",
      Name : "OperationFrequencies",
      DropDownValues : ["2.4 GHz", "5 GHz", "2.4 GHz AND 5 GHz"],
      IsDynamic : true,
      selectedDepents : { dropDownValue:"802.11n" , questionId : 5 },
      Value : {},
      Label : "Operation Frequencies",
      Id : 5099,
      IsHeading: false,
      IsMultiple : false,
      IsParent : false,
      ChildQuestons : []             
    }
  ] 
  }
] 