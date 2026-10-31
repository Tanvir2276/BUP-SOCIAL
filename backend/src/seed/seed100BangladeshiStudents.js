// 100 Authentic Bangladeshi Male and Female BUP Student Profiles for MySQL Database

const RAW_MALE_STUDENTS = [
  { name: 'Tanvir Naeem', college: 'Dhaka College', hometown: 'Cumilla', livesIn: 'Mirpur DOHS, Dhaka', school: 'Tongi Pilot School & Girls College', insta: 'tanvir_naeeem', motto: 'History only remembers how you finished.' },
  { name: 'Safaytul Islam Rafi', college: 'Notre Dame College', hometown: 'Chattogram', livesIn: 'Uttara Sector 11, Dhaka', school: 'Chittagong Collegiate School', insta: 'rafi_bup', motto: 'Engineering solutions for Smart Bangladesh 🇧🇩' },
  { name: 'Mahir Faisal', college: 'Rajuk Uttara Model College', hometown: 'Bogura', livesIn: 'Mirpur 12, Dhaka', school: 'Bogura Zilla School', insta: 'mahir_fst', motto: 'Building algorithms that matter 💻' },
  { name: 'Rifat Hasan', college: 'Adamjee Cantonment College', hometown: 'Dhaka', livesIn: 'Mirpur Cantonment, Dhaka', school: 'Cantonment Public School', insta: 'rifat.hasan_bup', motto: 'Continuous learning, perpetual growth.' },
  { name: 'Nabil Ahmed', college: 'Dhaka Residential Model College', hometown: 'Sylhet', livesIn: 'Mohammadpur, Dhaka', school: 'Sylhet Govt. Pilot School', insta: 'nabil_ahmed', motto: 'Code is poetry written with logic.' },
  { name: 'Ayman Sadiq', college: 'Notre Dame College', hometown: 'Dhaka', livesIn: 'Dhanmondi, Dhaka', school: 'St. Joseph Higher Secondary School', insta: 'ayman.sadiq_bup', motto: 'Inspiring future leaders through technology.' },
  { name: 'Sadman Sakib', college: 'BAF Shaheen College', hometown: 'Feni', livesIn: 'Mohakhali DOHS, Dhaka', school: 'Feni Govt Pilot High School', insta: 'sadman_sakib', motto: 'Consistency beats intensity every single time.' },
  { name: 'Fahim Rahman', college: 'Notre Dame College', hometown: 'Rajshahi', livesIn: 'Bashundhara R/A, Dhaka', school: 'Rajshahi Collegiate School', insta: 'fahim_rahman', motto: 'Innovate with empathy and precision.' },
  { name: 'Tahmid Chowdhury', college: 'Dhaka College', hometown: 'Brahmanbaria', livesIn: 'Banani, Dhaka', school: 'Annada Govt. High School', insta: 'tahmid.chy', motto: 'Dedicated to impactful data architectures.' },
  { name: 'Jabed Hossain', college: 'Chittagong College', hometown: 'Feni', livesIn: 'Mirpur 2, Dhaka', school: 'Feni Model High School', insta: 'jabed_hossain', motto: 'Dedicated to excellence in Section B 🎓' },
  { name: 'Farhan Tanveer', college: 'Adamjee Cantonment College', hometown: 'Barishal', livesIn: 'Mirpur DOHS, Dhaka', school: 'Barishal Zilla School', insta: 'farhan_bup', motto: 'Sustainable tech for a greener future 🌿' },
  { name: 'Ahsan Habib', college: 'Notre Dame College', hometown: 'Mymensingh', livesIn: 'Uttara Sector 4, Dhaka', school: 'Mymensingh Zilla School', insta: 'ahsan_habib', motto: 'Excellence is not an act, but a habit.' },
  { name: 'Kazi Shakib', college: 'St. Joseph College', hometown: 'Khulna', livesIn: 'Kalyanpur, Dhaka', school: 'Khulna Zilla School', insta: 'kazi_shakib', motto: 'Bridging engineering and real-world economics.' },
  { name: 'Zubair Al Mahmud', college: 'Rajuk Uttara Model College', hometown: 'Rangpur', livesIn: 'Uttara Sector 14, Dhaka', school: 'Rangpur Zilla School', insta: 'zubair_mahmud', motto: 'Curiosity fuels the greatest discoveries.' },
  { name: 'Saiful Islam', college: 'Dhaka College', hometown: 'Noakhali', livesIn: 'Farmgate, Dhaka', school: 'Noakhali Zilla School', insta: 'saiful_islam_bup', motto: 'Hard work in silence, let results make noise.' },
  { name: 'Tariqul Islam', college: 'Comilla Victoria Govt College', hometown: 'Cumilla', livesIn: 'Mirpur 10, Dhaka', school: 'Comilla Zilla School', insta: 'tariqul_bup', motto: 'Empowering minds, transforming futures.' },
  { name: 'Emon Hossain', college: 'Notre Dame College', hometown: 'Gazipur', livesIn: 'Uttara Sector 7, Dhaka', school: 'Rani Bilash Moni Govt Boys', insta: 'emon_hossain', motto: 'Precision in code, integrity in life.' },
  { name: 'Mehedi Hasan', college: 'BAF Shaheen College', hometown: 'Narayanganj', livesIn: 'Khilgaon, Dhaka', school: 'Narayanganj Govt High School', insta: 'mehedi_fst', motto: 'Pioneering intelligent automation systems.' },
  { name: 'Shihab Uddin', college: 'Dhaka Residential Model College', hometown: 'Tangail', livesIn: 'Mohammadpur, Dhaka', school: 'Bindubasini Govt Boys', insta: 'shihab_bup', motto: 'Knowledge is the true sovereign power.' },
  { name: 'Ariful Haque', college: 'Notre Dame College', hometown: 'Kushtia', livesIn: 'Dhanmondi, Dhaka', school: 'Kushtia Zilla School', insta: 'ariful_haque', motto: 'Engineering resilient telecom networks.' },
  { name: 'Sabbir Ahmed', college: 'Dhaka College', hometown: 'Pabna', livesIn: 'Mirpur 11, Dhaka', school: 'Pabna Zilla School', insta: 'sabbir_ahmed', motto: 'Building tomorrow with today\'s dedication.' },
  { name: 'Wasif Karim', college: 'Rajuk Uttara Model College', hometown: 'Dhaka', livesIn: 'Nikunja 2, Dhaka', school: 'Rajuk Uttara Model School', insta: 'wasif_karim', motto: 'Driven by curiosity and analytical rigor.' },
  { name: 'Shadman Shakil', college: 'Adamjee Cantonment College', hometown: 'Jessore', livesIn: 'Mirpur DOHS, Dhaka', school: 'Jessore Zilla School', insta: 'shadman_shakil', motto: 'Smart solutions for complex campus logistics.' },
  { name: 'Ashiqur Rahman', college: 'Notre Dame College', hometown: 'Dinajpur', livesIn: 'Bashundhara, Dhaka', school: 'Dinajpur Zilla School', insta: 'ashiq_bup', motto: 'Perseverance turns dreams into milestones.' },
  { name: 'Nazmul Huda', college: 'BAF Shaheen College Kurmitola', hometown: 'Dhaka', livesIn: 'Cantonment, Dhaka', school: 'BAF Shaheen School', insta: 'nazmul_huda', motto: 'Defense tech & cyber resilience advocate.' },
  { name: 'Towhidul Islam', college: 'Dhaka City College', hometown: 'Faridpur', livesIn: 'Lalmatia, Dhaka', school: 'Faridpur Zilla School', insta: 'towhid_islam', motto: 'Financial engineering meets data analytics.' },
  { name: 'Arman Hossain', college: 'Chittagong College', hometown: 'Chattogram', livesIn: 'Mirpur 1, Dhaka', school: 'Govt. Muslim High School', insta: 'arman_hossain', motto: 'Code hard, debug harder, deploy faster.' },
  { name: 'Mushfiqur Rahim', college: 'Notre Dame College', hometown: 'Bogra', livesIn: 'Uttara, Dhaka', school: 'Bogra Cantonment Public School', insta: 'mushfiq_bup', motto: 'Strive for excellence in every keystroke.' },
  { name: 'Rayhan Kabir', college: 'Dhaka College', hometown: 'Sirajganj', livesIn: 'Panthapath, Dhaka', school: 'BL Govt. High School', insta: 'rayhan_kabir', motto: 'Designing modern full-stack campus web apps.' },
  { name: 'Muntasir Billah', college: 'St. Joseph College', hometown: 'Jamalpur', livesIn: 'Green Road, Dhaka', school: 'Jamalpur Zilla School', insta: 'muntasir_bup', motto: 'Strategic diplomacy & international peace.' },
  { name: 'Shahriar Shuvo', college: 'Rajuk Uttara Model College', hometown: 'Dhaka', livesIn: 'Uttara Sector 3, Dhaka', school: 'Milestone College', insta: 'shahriar_shuvo', motto: 'Robotics microcontrollers & embedded dreams.' },
  { name: 'Zahid Hasan', college: 'Adamjee Cantonment College', hometown: 'Narsingdi', livesIn: 'Mirpur DOHS, Dhaka', school: 'Narsingdi Zilla School', insta: 'zahid_hasan_bup', motto: 'Building resilient database architectures.' },
  { name: 'Tanzeel Ahmed', college: 'Notre Dame College', hometown: 'Sylhet', livesIn: 'Bashundhara R/A, Dhaka', school: 'Jalalabad Cantonment Public', insta: 'tanzeel_ahmed', motto: 'Quantum computing and secure cryptography.' },
  { name: 'Sazzad Hossain', college: 'Dhaka College', hometown: 'Cox\'s Bazar', livesIn: 'Mirpur 14, Dhaka', school: 'Cox\'s Bazar Govt. High School', insta: 'sazzad_fst', motto: 'Marine IoT and environmental sensors.' },
  { name: 'Asif Mahmud', college: 'BAF Shaheen College', hometown: 'Munshiganj', livesIn: 'Tejgaon, Dhaka', school: 'Munshiganj High School', insta: 'asif_mahmud', motto: 'Advocating ethical AI & digital safety.' },
  { name: 'Rashedul Karim', college: 'Notre Dame College', hometown: 'Chittagong', livesIn: 'Banani DOHS, Dhaka', school: 'Chittagong Govt. High School', insta: 'rashed_karim', motto: 'High-frequency algorithmic financial systems.' },
  { name: 'Mahbub Alam', college: 'Dhaka City College', hometown: 'Chandpur', livesIn: 'Dhanmondi 27, Dhaka', school: 'Hasan Ali Govt. High School', insta: 'mahbub_alam', motto: 'Supply chain automation & cloud systems.' },
  { name: 'Imtiaz Ahmed', college: 'Rajuk Uttara Model College', hometown: 'Kishoreganj', livesIn: 'Uttara Sector 9, Dhaka', school: 'Kishoreganj Govt. Boys', insta: 'imtiaz_bup', motto: 'Computer vision and autonomous navigation.' },
  { name: 'Alvi Rahman', college: 'Adamjee Cantonment College', hometown: 'Bholaganj', livesIn: 'Mirpur Cantonment, Dhaka', school: 'Cantonment English School', insta: 'alvi_rahman', motto: 'Full-stack engineering with modern React.' },
  { name: 'Shafayat Hossain', college: 'Notre Dame College', hometown: 'Natore', livesIn: 'Eskaton, Dhaka', school: 'Natore Maharaja Govt. High', insta: 'shafayat_hossain', motto: 'Empowering campus through open source.' },
  { name: 'Nahian Rashid', college: 'Dhaka College', hometown: 'Joypurhat', livesIn: 'Mirpur 6, Dhaka', school: 'Joypurhat Govt. Boys', insta: 'nahian_rashid', motto: 'Distributed systems & event-driven microservices.' },
  { name: 'Tamim Iqbal', college: 'BAF Shaheen College', hometown: 'Chittagong', livesIn: 'Mohakhali, Dhaka', school: 'St. Placid\'s School', insta: 'tamim_fst', motto: 'Competitive programming & graph theory.' },
  { name: 'Shakil Anwar', college: 'Notre Dame College', hometown: 'Rangamati', livesIn: 'Indira Road, Dhaka', school: 'Rangamati Govt. High School', insta: 'shakil_anwar', motto: 'Environmental telemetry & GIS cartography.' },
  { name: 'Hasanul Banna', college: 'Dhaka Residential Model College', hometown: 'Patuakhali', livesIn: 'Mohammadpur, Dhaka', school: 'Patuakhali Jubilee High', insta: 'banna_bup', motto: 'Public administration & civic technology.' },
  { name: 'Fahad Bin Kashem', college: 'Rajuk Uttara Model College', hometown: 'Dhaka', livesIn: 'Uttara Sector 13, Dhaka', school: 'Uttara High School', insta: 'fahad_kashem', motto: 'AI-driven logistics & smart routing.' },
  { name: 'Nafis Sadik', college: 'St. Joseph College', hometown: 'Manikganj', livesIn: 'Kalabagan, Dhaka', school: 'Manikganj Model High School', insta: 'nafis_sadik', motto: 'Cybersecurity defense & threat hunting.' },
  { name: 'Junaed Siddiqui', college: 'Adamjee Cantonment College', hometown: 'Thakurgaon', livesIn: 'Mirpur 13, Dhaka', school: 'Thakurgaon Zilla School', insta: 'junaed_sid', motto: 'Econometrics & market behavioral analysis.' },
  { name: 'Samiul Haque', college: 'Notre Dame College', hometown: 'Meherpur', livesIn: 'Bashundhara, Dhaka', school: 'Meherpur Govt. High School', insta: 'samiul_haque', motto: 'Embedded IoT devices & firmware development.' },
  { name: 'Tanveer Hasan', college: 'Dhaka College', hometown: 'Netrokona', livesIn: 'Farmgate, Dhaka', school: 'Netrokona Anjuman High', insta: 'tanveer_hasan', motto: 'Dedicated to student leadership & research.' },
  { name: 'Arafat Rahman', college: 'BAF Shaheen College', hometown: 'Panchagarh', livesIn: 'Uttara Sector 6, Dhaka', school: 'Panchagarh BP Govt. High', insta: 'arafat_bup', motto: 'Excellence Through Knowledge in all pursuits.' },
];

const RAW_FEMALE_STUDENTS = [
  { name: 'Nusrat Jahan Nishi', college: 'Holy Cross College', hometown: 'Sylhet', livesIn: 'Dhanmondi, Dhaka', school: 'Sylhet Govt. Agragami Girls High', insta: 'nishi.jahan', motto: 'Code with passion, live with purpose ✨' },
  { name: 'Sumaiya Akter', college: 'BAF Shaheen College', hometown: 'Khulna', livesIn: 'Mohakhali DOHS, Dhaka', school: 'Khulna Govt. Coronation Girls', insta: 'sumaiya.akter', motto: 'Empowering communities through digital leadership 💡' },
  { name: 'Anika Tabassum', college: 'Viqarunnisa Noon College', hometown: 'Rajshahi', livesIn: 'Bashundhara R/A, Dhaka', school: 'Rajshahi Govt. Girls High School', insta: 'anika.tabassum', motto: 'Curiosity is the engine of achievement 🚀' },
  { name: 'Mehnaz Kabir', college: 'Holy Cross College', hometown: 'Dhaka', livesIn: 'Banani, Dhaka', school: 'Viqarunnisa Noon School', insta: 'mehnaz_kabir', motto: 'Building human-centric software experiences.' },
  { name: 'Fariha Tasnim', college: 'Viqarunnisa Noon College', hometown: 'Chattogram', livesIn: 'Uttara Sector 5, Dhaka', school: 'Dr. Khastagir Govt. Girls High', insta: 'fariha_tasnim', motto: 'Data tells stories when listened to carefully.' },
  { name: 'Sadia Afrin', college: 'Dhaka City College', hometown: 'Mymensingh', livesIn: 'Dhanmondi, Dhaka', school: 'Vidyamoyee Govt. Girls High', insta: 'sadia_afrin_bup', motto: 'New beginnings, endless opportunities 🌟' },
  { name: 'Maliha Zarin', college: 'Holy Cross College', hometown: 'Bogura', livesIn: 'Mirpur DOHS, Dhaka', school: 'Bogra Govt. Girls High School', insta: 'maliha_zarin', motto: 'Grace in collaboration, precision in code.' },
  { name: 'Tasnuva Haque', college: 'Rajuk Uttara Model College', hometown: 'Cumilla', livesIn: 'Uttara Sector 11, Dhaka', school: 'Comilla Nawab Faizunnesa Govt. Girls', insta: 'tasnuva_haque', motto: 'Driven by scientific inquiry & innovation.' },
  { name: 'Lamia Tabassum', college: 'Viqarunnisa Noon College', hometown: 'Narayanganj', livesIn: 'Shantinagar, Dhaka', school: 'Narayanganj Govt. Girls High', insta: 'lamia_tabassum', motto: 'Design thinking meets algorithmic excellence.' },
  { name: 'Raisa Mehreen', college: 'Holy Cross College', hometown: 'Dhaka', livesIn: 'Gulshan 2, Dhaka', school: 'Holy Cross Girls High School', insta: 'raisa_mehreen', motto: 'Pioneering accessible tech for campus scholars.' },
  { name: 'Farhana Yesmin', college: 'BAF Shaheen College', hometown: 'Barishal', livesIn: 'Mirpur 2, Dhaka', school: 'Barishal Govt. Girls High School', insta: 'farhana_yesmin', motto: 'Environmental stewardship & clean data.' },
  { name: 'Nazia Sultana', college: 'Viqarunnisa Noon College', hometown: 'Sylhet', livesIn: 'Dhanmondi 8, Dhaka', school: 'Sylhet Govt. Girls High School', insta: 'nazia_sultana', motto: 'Deep learning models for medical healthcare.' },
  { name: 'Samira Khan', college: 'Holy Cross College', hometown: 'Dhaka', livesIn: 'Mohakhali DOHS, Dhaka', school: 'St. Francis Xavier\'s Greenherald', insta: 'samira_khan_bup', motto: 'Global diplomacy, trade, and economic equity.' },
  { name: 'Sabina Yasmin', college: 'Dhaka City College', hometown: 'Feni', livesIn: 'Lalmatia, Dhaka', school: 'Feni Govt. Girls High School', insta: 'sabina_yasmin', motto: 'Turning business insights into real impact.' },
  { name: 'Afsana Mimi', college: 'Rajuk Uttara Model College', hometown: 'Gazipur', livesIn: 'Uttara Sector 4, Dhaka', school: 'Joydebpur Govt. Girls High', insta: 'afsana_mimi', motto: 'Continuous learning and academic diligence.' },
  { name: 'Mehzabin Rahman', college: 'Holy Cross College', hometown: 'Rangpur', livesIn: 'Mirpur DOHS, Dhaka', school: 'Rangpur Govt. Girls High School', insta: 'mehzabin_rahman', motto: 'Robotics sensor fusion & autonomous control.' },
  { name: 'Zarin Subah', college: 'Viqarunnisa Noon College', hometown: 'Jessore', livesIn: 'Bashundhara, Dhaka', school: 'Jessore Govt. Girls High School', insta: 'zarin_subah', motto: 'Creative frontend interfaces that delight.' },
  { name: 'Nafisa Anjum', college: 'BAF Shaheen College', hometown: 'Pabna', livesIn: 'Cantonment, Dhaka', school: 'Pabna Govt. Girls High School', insta: 'nafisa_anjum', motto: 'Telecom security & wireless signal analysis.' },
  { name: 'Adiba Farhin', college: 'Holy Cross College', hometown: 'Brahmanbaria', livesIn: 'Eskaton, Dhaka', school: 'Sabera Sobhan Govt. Girls High', insta: 'adiba_farhin', motto: 'Statistical modeling for economic policy.' },
  { name: 'Faiza Tasnim', college: 'Viqarunnisa Noon College', hometown: 'Kushtia', livesIn: 'Dhanmondi, Dhaka', school: 'Kushtia Govt. Girls High School', insta: 'faiza_tasnim', motto: 'Creating scalable digital academic tools.' },
  { name: 'Sabrina Mostafa', college: 'Rajuk Uttara Model College', hometown: 'Dhaka', livesIn: 'Uttara Sector 1, Dhaka', school: 'Rajuk Uttara Model School', insta: 'sabrina_mostafa', motto: 'Leading with integrity and empathy.' },
  { name: 'Fatima Tuz Zohra', college: 'Holy Cross College', hometown: 'Sirajganj', livesIn: 'Mirpur 10, Dhaka', school: 'Saleha Ishaque Govt. Girls High', insta: 'fatima_zohra', motto: 'Machine learning for climate telemetry.' },
  { name: 'Jannatul Ferdous', college: 'Viqarunnisa Noon College', hometown: 'Dinajpur', livesIn: 'Farmgate, Dhaka', school: 'Dinajpur Govt. Girls High School', insta: 'jannatul_bup', motto: 'Database architecture & query optimization.' },
  { name: 'Mithila Sen', college: 'BAF Shaheen College', hometown: 'Chattogram', livesIn: 'Mohakhali, Dhaka', school: 'St. Scholastica\'s Girls High', insta: 'mithila_sen', motto: 'Strategic human resource management.' },
  { name: 'Israt Jahan', college: 'Dhaka City College', hometown: 'Tangail', livesIn: 'Panthapath, Dhaka', school: 'Bindubasini Govt. Girls High', insta: 'israt_jahan_bup', motto: 'Financial accounting & corporate auditing.' },
  { name: 'Tasnim Mehzabin', college: 'Holy Cross College', hometown: 'Kishoreganj', livesIn: 'Kalabagan, Dhaka', school: 'SV Govt. Girls High School', insta: 'tasnim_mehzabin', motto: 'Public diplomacy and strategic negotiation.' },
  { name: 'Nusrat Sharmin', college: 'Viqarunnisa Noon College', hometown: 'Faridpur', livesIn: 'Mohammadpur, Dhaka', school: 'Sarada Sundari Govt. Girls', insta: 'nusrat_sharmin', motto: 'Software architecture & agile delivery.' },
  { name: 'Rumana Islam', college: 'Rajuk Uttara Model College', hometown: 'Dhaka', livesIn: 'Nikunja 1, Dhaka', school: 'Civil Aviation Higher Secondary', insta: 'rumana_islam', motto: 'Frontier AI research and computer vision.' },
  { name: 'Ayesha Siddiqua', college: 'Holy Cross College', hometown: 'Noakhali', livesIn: 'Mirpur DOHS, Dhaka', school: 'Noakhali Govt. Girls High School', insta: 'ayesha_siddiqua', motto: 'Security, privacy, and user dignity online.' },
  { name: 'Nabila Tahsin', college: 'Viqarunnisa Noon College', hometown: 'Chandpur', livesIn: 'Bashundhara, Dhaka', school: 'Chandpur Matripitha Govt. Girls', insta: 'nabila_tahsin', motto: 'Product design & behavioral psychology.' },
  { name: 'Shahrin Sultana', college: 'BAF Shaheen College', hometown: 'Munshiganj', livesIn: 'Khilgaon, Dhaka', school: 'A.V.J.M. Govt. Girls High', insta: 'shahrin_sultana', motto: 'Telecom network routing & QoS analytics.' },
  { name: 'Tahmina Akter', college: 'Dhaka City College', hometown: 'Patuakhali', livesIn: 'Green Road, Dhaka', school: 'Patuakhali Govt. Girls High School', insta: 'tahmina_akter', motto: 'Microfinance & rural community empowerment.' },
  { name: 'Mahbuba Jannat', college: 'Holy Cross College', hometown: 'Jamalpur', livesIn: 'Uttara Sector 12, Dhaka', school: 'Jamalpur Govt. Girls High School', insta: 'mahbuba_jannat', motto: 'Data structures & competitive coding.' },
  { name: 'Samia Sharmin', college: 'Viqarunnisa Noon College', hometown: 'Netrokona', livesIn: 'Mirpur 11, Dhaka', school: 'Netrokona Govt. Girls High', insta: 'samia_sharmin', motto: 'Creative digital narratives & campus journalism.' },
  { name: 'Tanjila Haque', college: 'Rajuk Uttara Model College', hometown: 'Joypurhat', livesIn: 'Uttara Sector 8, Dhaka', school: 'Joypurhat Govt. Girls High', insta: 'tanjila_haque', motto: 'Environmental GIS mapping & water analysis.' },
  { name: 'Zubaida Khanom', college: 'Holy Cross College', hometown: 'Thakurgaon', livesIn: 'Dhanmondi 15, Dhaka', school: 'Thakurgaon Govt. Girls High', insta: 'zubaida_khanom', motto: 'International humanitarian treaties & law.' },
  { name: 'Fahmida Yesmin', college: 'BAF Shaheen College', hometown: 'Narsingdi', livesIn: 'Banani, Dhaka', school: 'Narsingdi Govt. Girls High', insta: 'fahmida_yesmin', motto: 'Business intelligence & predictive forecasting.' },
  { name: 'Rawnak Jahan', college: 'Viqarunnisa Noon College', hometown: 'Panchagarh', livesIn: 'Bashundhara, Dhaka', school: 'Panchagarh Govt. Girls High', insta: 'rawnak_jahan', motto: 'Cloud native computing & Kubernetes.' },
  { name: 'Sadia Sultana', college: 'Dhaka City College', hometown: 'Manikganj', livesIn: 'Mohammadpur, Dhaka', school: 'Manikganj SK Govt. Girls High', insta: 'sadia_sultana', motto: 'Ethical investing & corporate stewardship.' },
  { name: 'Nasrin Akter', college: 'Holy Cross College', hometown: 'Meherpur', livesIn: 'Mirpur 14, Dhaka', school: 'Meherpur Govt. Girls High', insta: 'nasrin_akter', motto: 'Algorithms for efficient graph traversal.' },
  { name: 'Sumaiya Binte Alam', college: 'Viqarunnisa Noon College', hometown: 'Dhaka', livesIn: 'Kalyanpur, Dhaka', school: 'Viqarunnisa Noon School', insta: 'sumaiya_alam', motto: 'UI/UX accessibility for modern campus portals.' },
  { name: 'Farzana Haque', college: 'Rajuk Uttara Model College', hometown: 'Cox\'s Bazar', livesIn: 'Uttara Sector 10, Dhaka', school: 'Cox\'s Bazar Govt. Girls High', insta: 'farzana_haque', motto: 'Cyber threat modeling & penetration testing.' },
  { name: 'Nusrat Jahan Mim', college: 'Holy Cross College', hometown: 'Natore', livesIn: 'Indira Road, Dhaka', school: 'Natore Govt. Girls High School', insta: 'mim_nusrat', motto: 'Peacebuilding & multilateral negotiations.' },
  { name: 'Arifa Sultana', college: 'BAF Shaheen College', hometown: 'Kushtia', livesIn: 'Tejgaon, Dhaka', school: 'Kushtia Mohini Mohan Girls High', insta: 'arifa_sultana', motto: 'Marketing psychology & brand storytelling.' },
  { name: 'Sharmin Jahan', college: 'Viqarunnisa Noon College', hometown: 'Bholaganj', livesIn: 'Dhanmondi 4, Dhaka', school: 'Sylhet Govt. Girls High', insta: 'sharmin_jahan', motto: 'Signal filtering & DSP system architectures.' },
  { name: 'Tahsin Tabassum', college: 'Dhaka City College', hometown: 'Sirajganj', livesIn: 'Mirpur 2, Dhaka', school: 'Saleha Ishaque Girls High', insta: 'tahsin_tabassum', motto: 'Empowering women in STEM & engineering.' },
  { name: 'Jarin Tasnim', college: 'Holy Cross College', hometown: 'Tangail', livesIn: 'Shyamoli, Dhaka', school: 'Bindubasini Girls High', insta: 'jarin_tasnim', motto: 'Robotics microcontroller motor controllers.' },
  { name: 'Nafisa Tabassum', college: 'Rajuk Uttara Model College', hometown: 'Dhaka', livesIn: 'Uttara Sector 2, Dhaka', school: 'Milestone College', insta: 'nafisa_tabassum', motto: 'Econometric analysis of trade corridors.' },
  { name: 'Fatema Khatun', college: 'BAF Shaheen College', hometown: 'Chittagong', livesIn: 'Mohakhali DOHS, Dhaka', school: 'Chittagong Cantonment Girls', insta: 'fatema_khatun', motto: 'Dedication, sincerity, and continuous growth.' },
  { name: 'Sanjida Akter', college: 'Viqarunnisa Noon College', hometown: 'Mymensingh', livesIn: 'Eskaton Garden, Dhaka', school: 'Vidyamoyee Girls High', insta: 'sanjida_akter', motto: 'Excellence Through Knowledge • BUP Social.' },
];

const DEPARTMENTS = [
  { name: 'Department of ICT', code: 'ICT', prog: 'BICE', faculty: 'Faculty of Science & Technology (FST)' },
  { name: 'Department of CSE', code: 'CSE', prog: 'B.Sc. in CSE', faculty: 'Faculty of Science & Technology (FST)' },
  { name: 'Dept of Environmental Science', code: 'ES', prog: 'B.Sc. in ES', faculty: 'Faculty of Science & Technology (FST)' },
  { name: 'Department of Business Admin', code: 'BBA', prog: 'BBA (General)', faculty: 'Faculty of Business Studies (FBS)' },
  { name: 'Department of Economics', code: 'ECON', prog: 'BSS in Economics', faculty: 'Faculty of Arts & Social Sciences (FASS)' },
  { name: 'Department of Int. Relations', code: 'IR', prog: 'BSS in IR', faculty: 'Faculty of Security & Strategic Studies (FSSS)' },
];

export const get100BangladeshiStudentsSeedData = (passwordHash) => {
  const students = [];

  // 50 Males
  RAW_MALE_STUDENTS.forEach((item, index) => {
    const dept = DEPARTMENTS[index % DEPARTMENTS.length];
    const batchYear = 2021 + (index % 5);
    const batchName = `${dept.code === 'ICT' ? 'BICE' : dept.code}-${batchYear}`;
    const rollSuffix = (index + 1).toString().padStart(4, '0');
    const studentId = `${batchYear.toString().slice(2)}54901${rollSuffix}`;
    const section = index % 2 === 0 ? 'Section A' : 'Section B';
    const followers = 1200 + (index * 47) % 2800;
    const following = 200 + (index * 13) % 400;
    const email = `${item.name.toLowerCase().replace(/[\s\.]+/g, '')}@bup.edu.bd`;

    students.push({
      name: item.name,
      email,
      password: passwordHash,
      role: 'STUDENT',
      studentId,
      designation: index === 0 ? 'BUP Undergraduate Scholar' : index === 1 ? 'Student CR - Section A' : 'Undergraduate Student',
      facultyName: dept.faculty,
      departmentCode: dept.code,
      programName: dept.prog,
      batchName,
      sectionName: section,
      isVerified: true,
      followersCount: followers,
      followingCount: following,
      college: item.college,
      school: item.school,
      hometown: `${item.hometown}, Bangladesh`,
      livesIn: item.livesIn,
      instagram: item.insta,
      motto: item.motto,
      bio: `${dept.prog} scholar at ${dept.faculty}, BUP. Passionate about campus innovation & academic research.`,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    });
  });

  // 50 Females
  RAW_FEMALE_STUDENTS.forEach((item, index) => {
    const dept = DEPARTMENTS[(index + 2) % DEPARTMENTS.length];
    const batchYear = 2022 + (index % 4);
    const batchName = `${dept.code === 'ICT' ? 'BICE' : dept.code}-${batchYear}`;
    const rollSuffix = (index + 51).toString().padStart(4, '0');
    const studentId = `${batchYear.toString().slice(2)}54901${rollSuffix}`;
    const section = index % 2 === 0 ? 'Section B' : 'Section A';
    const followers = 1450 + (index * 53) % 3200;
    const following = 250 + (index * 17) % 450;
    const email = `${item.name.toLowerCase().replace(/[\s\.]+/g, '')}@bup.edu.bd`;

    students.push({
      name: item.name,
      email,
      password: passwordHash,
      role: 'STUDENT',
      studentId,
      designation: index === 0 ? 'Undergraduate Researcher' : index === 2 ? 'Student Representative' : 'Undergraduate Student',
      facultyName: dept.faculty,
      departmentCode: dept.code,
      programName: dept.prog,
      batchName,
      sectionName: section,
      isVerified: true,
      followersCount: followers,
      followingCount: following,
      college: item.college,
      school: item.school,
      hometown: `${item.hometown}, Bangladesh`,
      livesIn: item.livesIn,
      instagram: item.insta,
      motto: item.motto,
      bio: `${dept.prog} scholar at ${dept.faculty}, BUP. Enthusiastic about community leadership & academic excellence.`,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    });
  });

  return students;
};
