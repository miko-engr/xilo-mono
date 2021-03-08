exports.returnArrayByKey = function (value) {
    switch(value) {
        case 'priorInsuranceCompany':
            return ['Other Standard','Other Non-Standard','No Prior Insurance','21st Century','A.Central','AAA','AARP','Acadia','Access General','Ace','Acuity','Adirondack Ins Exchange','Aegis','Affirmative','AIC','AIG','Alfa Alliance','Allied','Allstate','America First','American Commerce','American Family','American Freedom Insurance Company','American National','Amerisure','Amica',	'Anchor General',	'Arrowhead','ASI Lloyds','Atlantic Mutual','Austin Mutual','Autoone','Auto-Owners','AutoTex','Badger Mutual','Balboa','Bankers','Beacon National','Bear River Mutual','Brethern Mutual','Bristol West','Buckeye','California Casualty','Cameron Mutual','Capital Insurance Group','Celina',	'Centennial','Central Mutual of OH','Charter','Chubb','Cincinnati','Citizens','CNA','Colonial Penn','Colorado Casualty','Columbia','Commerce West','Constitutional Casualty','Consumers','Cornerstone','Countrywide','Country Insurance','CSE','Cumberland','Dairyland','Deerbrook','Delta Lloyds Insurance Company',	'Depositors','Direct','Direct General',	'Discovery','Donegal','Drive','Electric','EMC','Encompass','Erie','Esurance',	'Eveready','Explorer','Farm Bureau','Farmers','Federated','Fidelity',	'Financial Indemnity','Firemans Fund',	'First Acceptance','First American',	'First Auto','First Chicago','First Connect','Flagship Insurance','Foremost','Founders','Frankenmuth','Fred Loya',	'Gateway','Geico','General Casualty','Germantown Mutual','GMAC','Grange','Great American','GRE/Go America','Grinnell','Guide One','Hallmark Insurance Company','Hanover','Harbor','Harleysville','Hartford OMNI','Hartford','Hastings Mutual','Hawkeye Security','HDI','Horace Mann','Houston General','IFA','Imperial Casualty','IMT Ins','Indiana Farmers','Indiana','Infinity',	'Insuremax','Insurequest','Integon','Integrity','Kemper',	'Kingsway','Liberty Mutual','Liberty Northwest','MAIF','Main Street America','Mapfre',	'Markel','Maryland Auto Insurance',	'Mendakota','Mendota','Merchants Group','Mercury','MetLife','Metropolitan','Mid-Continent','Midwestern Indemnity','Montgomery','Motorists Mutual','MSA','Mt. Washington','Mutual Benefit','Mutual of Enumclaw','National Lloyds Insurance Company','Nationwide',	'National General','New York Central Mutual','NJ Manufacturers','NJ Skylands',	'Nodak Mutual','Northstar',	'NYAIP','Occidental','Ocean Harbor','Ohio Casualty','Omaha P/C','Omni Insurance Co','One Beacon','Oregon Mutual','Palisades','Patriot',	'Patrons Oxford','Peerless/Montgomery','Pekin','Pemco','Penn National','Phoenix Indemnity','Plymouth Rock','Preferred Mutual','Proformance','Progressive','Prudential','Republic',	'Response','Rockford Mutual','Royal and Sun Alliance','Safeco','Safe Auto','Safeway','Sagamore','SECURA','Selective','Sentry Ins','Shelter Insurance','Southern County','Southern Mutual','Southern Trust','St. Paul/Travelers','Standard Mutual','Star Casualty','State Auto','State Farm','StillWater','Stonegate','Titan','Topa','Tower','Travelers','TWFG','Unigard','United Automobile','United Fire and Casualty','Unitrin','Universal','USAA','Utica National','Victoria','West Bend','Western National','Western Reserve Group','Westfield','White Mountains','Wilshire' ,'Wilson Mutual',	'Wisconsin Mutual','Windsor','Wind Haven','Zurich']
        case 'priorBodilyInjuryLimits':
            return ['Other Standard','Other Non-Standard','No Prior Insurance','21st Century','AAA','AAANCNU','AARP'  ,'Acuity','Adirondack Ins Exchange','Aegis','AIG','Alfa Alliance','Allianz of America','Allianz of America-Jefferson','Allied','Allied Trust','Allmerica','Allstate','America First','American Commerce','American Family','American Freedom Insurance Company','American Traditions','Amica','Anchor Insurance','ASI Lloyds','Atlantic Mutual','Atlas General Agency','Austin Mutual','Auto-Owners','Badger Mutual','Balboa','Bankers','Beacon National','Bear River Mutual','Bunker Hill','California Casualty','Capital Insurance Group','Capitol Preferred','Central Mutual of OH','Celina','Centauri','Chubb','Cincinnati','Citizens','CNA','Colorado Casualty','CSE','Cumberland','Cypress','Dairyland','Delta Lloyds Insurance Company','Donegal','Electric','EMC','Encompass','Erie','Esurance','Excelsior Insurance Company','Fair Plan','Farm Bureau','Farmers','Flagship Insurance','Fidelity','Firemans Fund','First American','Florida Family','Florida Peninsula','Geico','General Casualty','Germantown Mutual','GMAC','Goodville Mutual','Grange','Great American','GRE/Go America','Grinnell','Guide One','GulfStream','Hallmark Insurance Company','Hanover','Harleysville','Hartford','Hartford OMNI','Hawkeye Security','Heritage P/C','Homeowners of America' ,'Horace Mann','Houston General','Integon','Indiana','Indiana Farmers','Integrity','Kemper','Liberty Mutual','Liberty Northwest','LightHouse','Lloyds','Main Street America','Merchants Group','Mercury','MetLife','Midwestern Indemnity','Modern USA','Montgomery','Motorists Mutual','MSA','Mutual Benefit','Mutual of Enumclaw','National Lloyds Insurance Company','Nationwide','Nationwide-Scottsdale','New York Central Mutual','NJ Skylands','Northstar','Ohio Casualty','Omaha P/C','One Beacon','Oregon Mutual','Peerless/Montgomery','Pekin','Penn National','Plymouth Rock','Preferred Mutual','Progressive','Prudential','Republic','Royal and Sun Alliance','Safeco','SECURA','Selective','Shelter Insurance','Southern Fidelity','Southern Fidelity P/C','Southern Mutual','Southern Trust','St. Johns','St. Paul/Travelers','Standard Mutual','State Auto','State Farm','Titan','Tower','Towerhill','Travelers','TWFG','Unigard','United Fire and Casualty','Unitrin','Universal','UPCIC','USAA','Utica National','Vermont Mutual','Wellington Select','Wellington Standard','West Bend' ,'Western National','Western Reserve Group','Westfield','White Mountains','Wilson Mutual','Windsor','Zurich']
        case 'occupation': 
            return  ['Homemaker/Houseprsn','Retired','Disabled' ,'Unemployed','Student'  ,'Agriclt/Forestry/Fish','Art/Design/Media' ,'Banking/Finance/RE','Business/Sales/Offi','Construct/EnrgyTrds','Education/Library','Engr/Archt/Sci/Math'    ,'Government/Military','Info Tech'    ,'Insurance'    ,'Lgl/Law Enfcmt/Sec','Maint/Rpr/Hsekeep' ,'Mfg/Production'    ,'Med/Soc Svcs/Relig','Person.Care/Service' ,'Sports/Recreation'  ,'Other']
        case 'industry': 
            return  ['Homemaker/Houseprsn','Retired','Disabled' ,'Unemployed','Student'  ,'Agriclt/Forestry/Fish','Art/Design/Media' ,'Banking/Finance/RE','Business/Sales/Offi','Construct/EnrgyTrds','Education/Library','Engr/Archt/Sci/Math'    ,'Government/Military','Info Tech'    ,'Insurance'    ,'Lgl/Law Enfcmt/Sec','Maint/Rpr/Hsekeep' ,'Mfg/Production'    ,'Med/Soc Svcs/Relig','Person.Care/Service' ,'Sports/Recreation'  ,'Other']
        case 'poolType':
            return ['Above Ground with Slide', 'Above Ground without Slide', 'In Ground with Slide', 'In Ground without Slide'];
        case 'homeFoundationType':
            return ['Slab', 'Crawlspace', 'PiersOrPile', 'SuspendedOverHillside'];
        case 'educationLevel':
            return ['No High School Diploma','High School Diploma','Some College - No Degree','Vocational/Technical Degree','Associates Degree','Bachelors','Masters','Phd','Medical Degree','Law Degree']
        case 'lengthAtAddress':
            return ['6 months or less','6-12 months','1','2','3','4','5','6','7','8','9','10','More than 10']
        case 'bodilyInjuryCoverage':
            return ['State Minimum','10/20','12/25','12.5/25','15/30','20/40','20/50','25/25','25/50','25/65','30/60','50/50','50/100','100/100','100/300','200/600','250/500','300/300','500/500','500/1000','1000/1000','35 CSL','50 CSL','55 CSL','100 CSL','115 CSL','300 CSL','500 CSL','1000 CSL']
        case 'priorLiabilityLimit':
            return ['State Minimum','10/20','12/25','15/30','25/25','25/50','50/50','50/100','100/100','100/300','250/500','300/300','500/500','1000/1000','55CSL','100CSL','300CSL','500CSL','None',]
        case 'homeownership': 
            return ["Home (owned)","Condo (owned)","Apartment","Rental Home/Condo","Mobile Home","Live With Parents","Other"];
        case 'roadsideCoverage': 
            return ['No Coverage','25','40','50','75','80','100','120','200'];
        case 'collision': 
            return ["0", "50", "100", "200", "250", "300", "500", "750", "1000", "1500","2000","2500"];
        case 'comprehensive': 
            return ["0", "50", "100", "200", "250", "300", "500", "750", "1000", "1500","2000","2500"];
        case 'rentalCoverage':
            return ["No Coverage","15/450","20/600","25/750","30/900","35/1050","40/1200","45/1350","50/1500","75/2250","100/3000"];
        case 'roofType': 
        return ["ARCHITECTURAL SHINGLES","ASBESTOS","ASPHALT SHINGLES","COMPOSITION","COPPER(FLAT)","COPPER(PITCHED)","CORRUGATED STEEL(FLAT)","CORRUGATED STEEL(PITCHED)","FIBERGLASS","FOAM","GRAVEL","METAL(FLAT)","METAL(PITCHED)","MINERAL FIBER SHAKE","OTHER","PLASTIC(FLAT)","PLASTIC(PITCHED)","ROCK","ROLLED PAPER(FLAT)","ROLLED PAPER(PITCHED)","RUBBER FLAT","RUBBER(PITCHED)","SLATE","TAR","TAR and GRAVEL","TILE(CLAY)","TILE(CONCRETE)","TILE(SPANISH)","TIN(FLAT)","TIN(PITCHED)","WOOD FIBERGLASS SHINGLES","WOOD SHAKE","WOOD SHINGLES"]
        case 'structureType':
            return ["Apartment","Backsplit","Bi-Level","Bi-Level/Row Center","Bi-Level/Row End","Bungalow","Cape Cod","Colonial","Condo","Coop","Contemporary","Cottage","Dwelling","Federal Colonial","Mediterranean","Ornate Victorian","Queen Anne","Raised Ranch","Rambler","Ranch","Rowhouse","Rowhouse Center","Rowhouse End","Southwest Adobe","Split Foyer","Split Level","Substandard","Townhouse","Townhouse Center","Townhouse End","Tri-Level","Tri-Level Center","Victorian"]
        case 'constructionType':
            return ["Adobe","Aluminum/Vinyl","Barn Plank","Brick","Brick on Block","Brick on Block, Custom","Brick Veneer","Brick Veneer, Custom","Cement Fiber Shingles","Clapboard","Concrete Decorative Block, Painted","Exterior Insulation and Finish System (EIFS)","Fire Resistant","Frame","Logs","Poured Concrete","Siding, Aluminum","Siding, Hardboard","Siding, Plywood","Siding, Steel","Siding, T-111","Siding, Vinyl","Siding, Wood","Slump Block","Solid Brick","Solid Brick, Custom","Solid Brownstone","Solid Stone","Solid Stone, Custom","Stone on Block","Stone on Block, Custom Stone","Stone Veneer","Stone Veneer, Custom","Stucco","Stucco on Block","Stucco on Frame","Victorian Scalloped Shakes","Window Wall","Wood Shakes"]
        case 'residenceType':
            return ["One Family","Two Family","Three Family","Four Family"];
        case 'heatType':
            return ["Electric","Gas","Gas - Forced Air","Gas - Hot Water","Oil","Oil - Forced Air","Oil - Hot Water","Other","Solid Fuel"];
        case 'foundationType': 
            return ["Basement","Closed","Concrete Slab","Concrete Stilts/Pilings","Crawlspace","Crawlspace/Foundations and Piers &gt; 6&apos; elevations","Crawlspace/Enclosed Piers up to 6&apos; elevations","Deep Pilings","Elevated Post/Pier&amp;Beam","Open","Open-Enclosed with Lattice","Open Foundations/Open Piers &gt; 6&apos; elevations","Open Foundations/Open Piers up to 6&apos; elevations","Pier&amp;Grade Beam","Pilings-Other","Pilings-Wood","Pilings/Stilts of Reinforced Masonry Construction","Shallow Basement","Slab","Stilts/Pilings 8&apos;-10&apos; elevations","Stilts/Pilings other","Stilts with Sweep Away Walls","Wood Stilts/Pilings"]
        case 'pipType':
            return ["No Coverage","2500","5000","10000","25000","50000","100000"];
        case 'homePrimaryUse':
            return ["Primary","Secondary","Seasonal","Farm","Unoccupied","Vacant","COC"];
        case 'vehicleUseCd':
            return ["Business","Farming","Pleasure","To/From Work","To/From School"]
        case 'constructionMethod':
            return ["Site Built","Modular","Manufactured/Mobile","Unknown"];
        case 'gender':
            return ['Male', 'Female', 'X - Not Specified'];
        case 'applicantGenderCd':
            return ['Male', 'Female', 'X - Not Specified'];
        case 'maritalStatus':
            return ['Single','Married','Domestic Partner','Widowed','Separated','Divorced']
        case 'applicantMaritalStatusCd':
            return ['Single','Married','Domestic Partner','Widowed','Separated','Divorced']
        case 'durationYears':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
        case 'accidentDescription':
            return ["At Fault With Injury","At Fault With No Injury","Not At Fault"]
        case 'violationDescription':
            return ["Careless Driving","Cell Phone","Child Safety Restraint","Defective Equipment","Divided Highways","Double Lines","Driving Left of Center","Driving on Sus. License","Driving too slow","Driving without lights","DUI","Eluding Police","Failure to Obey Signal","Failure to Stop","Failure to Yield","Failure To Observe A Safety Zone","Failure to show documents","False Reporting","Felony","Following too Closely","Homicide","Illegal Turn","Improper Parking","Improper Passing","Improper Loads","Leaving scene of an Accident/Hit and Run","Motorcycle Violation","Other Major","Other Minor","Open Container","Operating Vehicle without Permission","Out of State","Passing School Bus","Racing/Drag Racing","Recreational Vehicle","Refusal to submit to chemical test","Speeding 1-5","Speeding 6-10","Speeding 11-15","Speeding 16-20","Speeding 21+","Speed over 100mph","Speeding Violation-Major","Speeding Violation-Minor","Seat Belt","Suspension","Ticket Violation Not Listed","Towing","Transportation of Hazardous Materials","Unsafe Operation of a Motor Vehicle","Vehicle Theft","Wrong Way/Wrong Lane"]
        case 'damageClaimDescription':
            return ["FIRE","HIT ANIMAL","THEFT","TOWING","VANDALISM","GLASS","TORNADO/HURRICANE","FLOOD","WIND/HAIL","ALL OTHER"]
        case 'allPerilsDeductible':
            return ['100', '250', '500', '750', '1000', '2000', '2500', '4000', '5000'];
        case 'theftDeductible':
            return ['100', '250', '500', '750', '1000', '2000', '2500', '4000', '5000'];
        case 'windDeductible':
            return ['100', '250', '500', '750', '1000', '2000', '2500', '4000', '5000'];
        case 'personalLiabilityCoverage':
            return ['25000', '50000', '100000', '200000', '300000', '400000', '500000'];
        case 'medicalPaymentsCoverage':
            return ['1000', '2000', '3000', '4000', '5000'];
        case 'policyType':
            return ["HO3",'HO4','HO5','HO6'];
        case 'increaseReplacementCostPercent':
            return ["25",'50','100'];
        case 'waterBackupCoverage':
            return ['Full','1000','2000','3000','4000','5000','6000','7000','8000','9000','10000','15000','20000','25000','50000'];
        case 'smokeDetectorType':
            return ['Local', 'Direct', 'Central'];
        case 'burglarAlarmType':
            return ['Local', 'Direct', 'Central'];
        case 'sprinklerSystemType':
            return ['Local', 'Direct', 'Central'];
        case 'fireSystemType':
            return ['Local', 'Direct', 'Central'];
        case 'extraTransportationCoverage':
            return ['No Coverage','15/450','20/600','25/750','30/900','35/1050','40/1200','45/1350','50/1500','75/2250','100/3000'];
        case 'autoCoverageTerm':
            return ['6 Month', '12 Month'];
        case 'priorPolicyTerm':
            return ['6 Month', '12 Month'];
        case 'hasDaytimeLights':
            return ['Yes', 'No'];
        case 'hasAntiLockBrakes':
            return ['Yes', 'No'];
        case 'hadLicenseSuspended':
            return ['Yes', 'No'];
        case 'hasPackage':
            return ['Yes', 'No'];
        case 'isGoodStudent':
            return ['Yes', 'No'];
        case 'hasDriversTrainingDiscount':
            return ['Yes', 'No'];
        case 'isSafeDriver':
            return ['Yes', 'No'];
        case 'needsSR22':
            return ['Yes', 'No'];
        case 'hasMultiCarDiscount':
            return ['Yes', 'No'];
        case 'isInRetirementCommunity':
            return ['Yes', 'No'];
        case 'hasMultiPolicy':
            return ['Yes', 'No'];
        case 'hasSnowPlow':
            return ['Yes', 'No'];
        case 'hasAlternateGarage':
            return ['Yes', 'No'];
        case 'vehicleInspectionType':
            return ['Inspection Completed: No Damage', 'Inspection Completed: Damaged', 'No Inspection Needed', 'No Acknowledgement Form Attached', 'Acknowledgement Form Attached', 'Bill of Sale For New Vehicle'];
        case 'doesCarpool':
            return ['Yes', 'No'];
        case 'performanceType':
            return ['Standard', 'Sports', 'Intermediate', 'High Performance'];
        case 'isNewVehicle':
            return ['Yes', 'No'];
        case 'isUsedForFoodDelivery':
            return ['Yes', 'No'];
        case 'hasExistingDamage':
            return ['Yes', 'No'];
        case 'fullGlassCoverage':
            return ['Yes', 'No'];
        case 'liabilityNotRequired':
            return ['Yes', 'No'];
        case 'loanAndLeaseCoverage':
            return ['Yes', 'No'];
        case 'wantsReplacementCostCoverage':
            return ['Yes', 'No'];
        case 'waiverCollisionDamage':
            return ['Yes', 'No'];
        case 'isAAAMember':
            return ['Yes', 'No'];
        case 'passiveRestraintsType':
            return ['None','Automatic Seatbelts','Airbag (Drvr Side)','Auto Stbelts/Drvr Airbag','Airbag Both Sides','Auto Stbelts/Airbag Both'];
        case 'antiTheftType':
            return ['None','Active','Alarm Only','Passive','Vehicle Recovery System','Both Active and Passive','VIN# Etching'];
        case 'relationship':
            return ["Child","Domestic Partner","Employee","Insured","Other","Parent","Relative","Spouse"];
        case 'state':
            return ["AK","AL","AR","AS","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
        case 'driverLicenseStateCd':
            return ["AK","AL","AR","AS","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
        case 'yearsAtCurrentAddress':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'More than 15'];
        case 'yearsAtPreviousAddress':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'More than 15'];
        case 'monthsAtCurrentAddress':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        case 'monthsAtPreviousAddress':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        case 'yearsWithCarrier':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'More than 15'];
        case 'priorInsuranceYears':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'More than 15'];
        case 'monthsWithCarrier':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        case 'priorInsuranceMonths':
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        case 'autoDeathIndemnity':
            return ['No Coverage', '5000', '10000'];
        case 'umPd':
            ['No Coverage','State Minimum','10000','15000','20000','25000','50000','100000'];
        case 'apip':
            return ['1000','2000', '3000','4000'];
        case 'pipDeductible':
            return ['None','250', '500','1000'];
        case 'tortLimitation':
            return ['Tort Limitation Not Rejected','Rejected By All Family Members', 'Rejected By Some Family Members'];
        case 'personalInjuryCoverage':
            return ['No Coverage', 'Reject','Basic', '2500', '5000', '10000', '20000','30000','40000','50000','75000','100000'];
        case 'vehicleModelYear':
            return ['2020','2019','2018','2017','2016','2015','2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003','2002','2001','2000','1999','1998','1997','1996','1995','1994','1993','1992','1991','1990','1989','1988','1987','1986','1985','1984','1983','1982','1981','1980','1979','1978','1977','1976','1975','1974','1973','1972','1971','1970','1969','1968','1967','1966'];
        case 'yearBuilt':
            return ['2020','2019','2018','2017','2016','2015','2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003','2002','2001','2000','1999','1998','1997','1996','1995','1994','1993','1992','1991','1990','1989','1988','1987','1986','1985','1984','1983','1982','1981','1980','1979','1978','1977','1976','1975','1974','1973','1972','1971','1970','1969','1968','1967','1966'];
        case 'roofUpdateYear':
            return ['2020','2019','2018','2017','2016','2015','2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003','2002','2001','2000','1999','1998','1997','1996','1995','1994','1993','1992','1991','1990','1989','1988','1987','1986','1985','1984','1983','1982','1981','1980','1979','1978','1977','1976','1975','1974','1973','1972','1971','1970','1969','1968','1967','1966'];
        case 'electricalUpdateYear':
            return ['2020','2019','2018','2017','2016','2015','2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003','2002','2001','2000','1999','1998','1997','1996','1995','1994','1993','1992','1991','1990','1989','1988','1987','1986','1985','1984','1983','1982','1981','1980','1979','1978','1977','1976','1975','1974','1973','1972','1971','1970','1969','1968','1967','1966'];
        case 'plumbingUpdateYear':
            return ['2020','2019','2018','2017','2016','2015','2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003','2002','2001','2000','1999','1998','1997','1996','1995','1994','1993','1992','1991','1990','1989','1988','1987','1986','1985','1984','1983','1982','1981','1980','1979','1978','1977','1976','1975','1974','1973','1972','1971','1970','1969','1968','1967','1966'];
        case 'heatingUpdateYear':
            return ['2020','2019','2018','2017','2016','2015','2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003','2002','2001','2000','1999','1998','1997','1996','1995','1994','1993','1992','1991','1990','1989','1988','1987','1986','1985','1984','1983','1982','1981','1980','1979','1978','1977','1976','1975','1974','1973','1972','1971','1970','1969','1968','1967','1966'];
        case 'vehicleDaysDrivenPerWeek':
            return ['1', '2', '3', '4', '5', '6', '7'];
        case 'weeksPerMonthDriven':
            return ['1', '2', '3', '4'];
        case 'numberOfWoodBurningStoves':
            return ['1', '2', '3', '4', '5', '6'];
        case 'numberOfFireplaces':
            return ['1', '2', '3', '4', '5', '6'];
        case 'numOfHalfBaths':
            return ['0','1', '2', '3', '4', '5', '6'];
        case 'numOfFullBaths':
            return ['0','1', '2', '3', '4', '5', '6'];
        case 'garageSize':
            return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        case 'ownOrLeaseVehicle':
            return ['Owned', 'Leased', 'Lien'];
        case 'propertyDamageCoverage':
            return ['No Coverage','State Minimum','5000','7500','10000','15000','20000','25000','35000','50000','100000','250000','300000','500000'];
        case 'medicalCoverage':
            return ['None','500','1000','2000','2500','5000','10000','15000','25000','50000','100000'];
        case 'uninsuredMotoristCoverage':
            return ['Reject','State Minimum','10/20','12/25','12.5/25','15/30','20/40','20/50','25/25','25/50','25/60','25/65','30/60','35/80','50/50','50/100','100/100','100/200','100/300','200/400','200/600','250/500','250/1000','300/300','300/500','500/500','500/1000','1000/1000','35 CSL','50 CSL','55 CSL','100 CSL','300 CSL','500 CSL','600 CSL','1000 CSL'];
        case 'underInsuredMotoristCoverage':
            return ['Reject','State Minimum','10/20','12/25','12.5/25','15/30','20/40','20/50','25/25','25/50','25/60','25/65','30/60','35/80','50/50','50/100','100/100','100/200','100/300','200/400','200/600','250/500','250/1000','300/300','300/500','500/500','500/1000','1000/1000','35 CSL','50 CSL','55 CSL','100 CSL','300 CSL','500 CSL','600 CSL','1000 CSL'];
        case 'basementFinishPercentage':
            return ['0', '10', '25', '50', '75', '100'];
        }
};