import { LanguageCode, Product, ProductCategory, CustomPage, SiteSettings } from '../types';

export interface ProductLocalizedFields {
  name: string;
  short_description: string;
  description: string;
  disclaimer?: string;
  acknowledgment_text?: string;
  storage_instructions?: string;
  appearance?: string;
}

export interface CategoryLocalizedFields {
  name: string;
  description: string;
}

export interface CustomPageLocalizedFields {
  title: string;
  category: string;
  summary: string;
  content: string;
}

export const CATEGORY_TRANSLATIONS: Record<LanguageCode, Record<string, CategoryLocalizedFields>> = {
  en: {
    'cat-brain': { name: 'Brain', description: 'Cognitive & Neurological Reference Standards' },
    'cat-cellular': { name: 'Cellular', description: 'Cellular Longevity & Mitochondrial Reagents' },
    'cat-growth-hormone': { name: 'Growth Hormone', description: 'Growth Hormone Secretagogues & Peptides' },
    'cat-hormone': { name: 'Hormone', description: 'Endocrine & Metabolic Signaling Standards' },
    'cat-metabolic': { name: 'Metabolic', description: 'Metabolic Regulators & Glucose Pathway Ligands' },
    'cat-skin-tissue': { name: 'Skin/Tissue', description: 'Tissue Repair, Collagen & Wound Assay Standards' },
    'cat-compounds-consumables': { name: 'Compounds & Consumables', description: 'Laboratory Solvents, Buffers & Consumables' },
  },
  ar: {
    'cat-brain': { name: 'الدماغ والأعصاب', description: 'معايير مرجعية عصبية وإدراكية للبحوث المخبرية' },
    'cat-cellular': { name: 'البيولوجيا الخلوية', description: 'كواشف الميتوكوندريا وطول العمر الخلوي' },
    'cat-growth-hormone': { name: 'هرمون النمو', description: 'محفزات إفراز هرمون النمو وببتيدات الإشارة' },
    'cat-hormone': { name: 'الهرمونات والغدد', description: 'معايير إشارات الغدد الصماء والمسارات الهرمونية' },
    'cat-metabolic': { name: 'التمثيل الغذائي والأيض', description: 'منظمات التمثيل الغذائي ومسارات الجلوكوز' },
    'cat-skin-tissue': { name: 'الأنسجة والجلد', description: 'معايير إصلاح الأنسجة وتخليق الكولاجين' },
    'cat-compounds-consumables': { name: 'المركبات والمستهلكات', description: 'مذيبات مخبرية، محاليل دارئة ومستهلكات معقمة' },
  },
  es: {
    'cat-brain': { name: 'Cerebro y Neurociencias', description: 'Estándares de referencia cognitivos y neurológicos' },
    'cat-cellular': { name: 'Biología Celular', description: 'Reactivos mitocondriales y de longevidad celular' },
    'cat-growth-hormone': { name: 'Hormona del Crecimiento', description: 'Secretagogos de hormona de crecimiento y péptidos' },
    'cat-hormone': { name: 'Hormonas y Endocrinología', description: 'Estándares de señalización endocrina y hormonal' },
    'cat-metabolic': { name: 'Metabolismo', description: 'Reguladores metabólicos y vías de glucosa' },
    'cat-skin-tissue': { name: 'Piel y Tejidos', description: 'Estándares de reparación tisular y colágeno' },
    'cat-compounds-consumables': { name: 'Compuestos y Consumibles', description: 'Solventes de laboratorio, tampones y consumibles estériles' },
  },
  fr: {
    'cat-brain': { name: 'Cerveau & Neurosciences', description: 'Standards de référence cognitifs et neurologiques' },
    'cat-cellular': { name: 'Biologie Cellulaire', description: 'Réactifs mitochondriaux et longévité cellulaire' },
    'cat-growth-hormone': { name: 'Hormone de Croissance', description: 'Sécrétagogues de l\'hormone de croissance et peptides' },
    'cat-hormone': { name: 'Hormones & Endocrinologie', description: 'Standards de signalisation endocrinienne' },
    'cat-metabolic': { name: 'Métabolisme', description: 'Régulateurs métaboliques et voies du glucose' },
    'cat-skin-tissue': { name: 'Peau & Tissus', description: 'Standards de régénération tissulaire et collagène' },
    'cat-compounds-consumables': { name: 'Composés & Consommables', description: 'Solvants de laboratoire, tampons et consommables stériles' },
  },
  de: {
    'cat-brain': { name: 'Gehirn & Neurologie', description: 'Kognitive & neurologische Referenzstandards' },
    'cat-cellular': { name: 'Zellbiologie', description: 'Mitochondriale Reagenzien & Zell-Langlebigkeit' },
    'cat-growth-hormone': { name: 'Wachstumshormon', description: 'Wachstumshormon-Sekretagoga & Peptide' },
    'cat-hormone': { name: 'Hormone & Endokrinologie', description: 'Endokrine & hormonelle Signalstandards' },
    'cat-metabolic': { name: 'Stoffwechsel & Metabolismus', description: 'Metabolische Regulatoren & Glukosewege' },
    'cat-skin-tissue': { name: 'Haut & Gewebe', description: 'Gewebereparatur, Kollagen- & Wundheilungsstandards' },
    'cat-compounds-consumables': { name: 'Chemikalien & Verbrauchsmaterialien', description: 'Laborlösungsmittel, Puffer & sterile Verbrauchsmaterialien' },
  }
};

export const PRODUCT_TRANSLATIONS: Record<LanguageCode, Record<string, ProductLocalizedFields>> = {
  en: {
    'prod-tesam10mg': {
      name: 'Tesamorelin 10mg',
      short_description: 'Synthetic GHRH analogue peptide engineered for growth hormone pulsatility and metabolic research.',
      description: 'Tesamorelin is a synthetic analogue of growth hormone-releasing hormone (GHRH) consisting of 44 amino acids with a hexenoyl moiety attached at the N-terminus. Produced under cGMP conditions for laboratory analysis.',
      disclaimer: 'For in vitro laboratory research use only. Not for human or veterinary administration.',
      acknowledgment_text: 'I acknowledge that this chemical compound is purchased exclusively for in vitro laboratory research.'
    },
    'prod-nad500mg': {
      name: 'NAD+ 500mg',
      short_description: 'Ultra-pure Nicotinamide Adenine Dinucleotide for mitochondrial bioenergetics and sirtuin assay research.',
      description: 'NAD+ (Nicotinamide Adenine Dinucleotide) is an essential coenzyme found in all living cells, central to cellular redox reactions, oxidative phosphorylation, and sirtuin-mediated epigenetic regulation.',
      disclaimer: 'For laboratory and analytical calibration research only. Not for clinical diagnostic use.',
      acknowledgment_text: 'I confirm that this substance is strictly for laboratory analytical testing.'
    },
    'prod-motsc10mg': {
      name: 'MOTS-c 10mg',
      short_description: 'Mitochondrial-derived peptide (MDP) standard for metabolic signaling and insulin regulation assays.',
      description: 'MOTS-c is a 16-amino acid peptide encoded within the mitochondrial 12S rRNA gene. Investigated in cellular metabolic plasticity, AMPK phosphorylation, and exercise-mimetic pathways.',
      disclaimer: 'For in vitro research use only. Not for human consumption.',
      acknowledgment_text: 'I confirm that this purchase is strictly intended for scientific laboratory research.'
    },
    'prod-ghkcu100mg': {
      name: 'GHK-Cu 100mg',
      short_description: 'High-purity copper tripeptide complex for dermal remodeling, collagen synthesis, and cell culture studies.',
      description: 'GHK-Cu (Glycyl-L-Histidyl-L-Lysine Copper Tripeptide-1) is a natural copper-binding peptide complex examined in extracellular matrix synthesis, collagen remodeling, and gene expression studies.',
      disclaimer: 'For in vitro laboratory research use only. Not for cosmetic or human application.',
      acknowledgment_text: 'I confirm that this chemical compound is strictly for laboratory research.'
    },
    'prod-bpc15710mg': {
      name: 'BPC-157 10mg',
      short_description: 'Synthetic pentadecapeptide sequence for tissue regeneration, tendon assay, and cellular cytoprotection research.',
      description: 'BPC-157 (Body Protection Compound 157) is a 15-amino acid peptide derived from human gastric juice protein BPC. Studied extensively in angiogenesis, VEGF expression, and soft tissue repair pathways.',
      disclaimer: 'For in vitro laboratory research only. Not for human or veterinary therapeutic use.',
      acknowledgment_text: 'I acknowledge that BPC-157 is strictly for in vitro laboratory research.'
    },
    'prod-bac500ml': {
      name: 'BAC Water 500ml (Sterile)',
      short_description: 'Sterile bacteriostatic reconstitution vehicle formulated with 0.9% USP grade benzyl alcohol.',
      description: 'Bacteriostatic Water for laboratory reconstitution containing 0.9% USP benzyl alcohol as an antimicrobial preservative. Sterile-filtered through 0.22 micron membrane in a certified cleanroom environment.',
      disclaimer: 'For laboratory reagent reconstitution only. Not for parenteral injection in humans.',
      acknowledgment_text: 'I confirm this reagent is purchased exclusively for in vitro laboratory reconstitution.'
    },
    'prod-glp3rt10mg': {
      name: 'GLP3-RT 10mg (Triple Agonist)',
      short_description: 'Triple-action GIP/GLP-1/Glucagon receptor tri-agonist peptide standard for metabolic research.',
      description: 'GLP3-RT (Retatrutide reference analogue) is a single peptide backbone with balanced agonism at GIP, GLP-1, and glucagon receptors. Synthesized for precision receptor binding assays.',
      disclaimer: 'For in vitro receptor assay and analytical research only. Strictly prohibited for human use.',
      acknowledgment_text: 'I acknowledge that this triple-agonist compound is strictly for laboratory research.'
    },
    'prod-wolver10mg': {
      name: 'Wolverine Blend 10mg (BPC-157 + TB-500)',
      short_description: 'Synergistic dual-peptide research blend of BPC-157 (5mg) and TB-500 (5mg) for tissue repair assays.',
      description: 'Wolverine Blend combines equal 5mg ratios of BPC-157 and Thymosin Beta-4 (TB-500). Formulated for comparative synergistic extracellular matrix and actin-sequestering studies in vitro.',
      disclaimer: 'For in vitro laboratory research use only. Not for human or animal therapeutic use.',
      acknowledgment_text: 'I confirm this blend is strictly for laboratory assay research.'
    },
    'prod-ipm1295nd10mg': {
      name: 'CJC-1295 (No DAC) / Ipamorelin 10mg Blend',
      short_description: 'Co-lyophilized GHRH and Ghrelin-receptor secretagogue blend (5mg / 5mg) for endocrine pathway research.',
      description: 'A 1:1 synergistic research formulation of CJC-1295 (Modified GRF 1-29 without DAC) and Ipamorelin pentapeptide. Designed for in vitro somatotroph receptor kinetics.',
      disclaimer: 'For in vitro laboratory research only. Not for human administration.',
      acknowledgment_text: 'I acknowledge that this secretagogue blend is strictly for scientific research.'
    },
    'prod-tb50010mg': {
      name: 'TB-500 10mg (Thymosin Beta-4)',
      short_description: 'Synthetic 43-amino acid peptide for actin polymerization and cellular migration studies.',
      description: 'TB-500 is a synthetic derivative of the naturally occurring actin-regulating protein Thymosin Beta-4. Extensively investigated in cellular migration, dermal repair, and wound healing kinetics.',
      disclaimer: 'For in vitro laboratory research use only. Not for veterinary or human use.',
      acknowledgment_text: 'I acknowledge that TB-500 is strictly for laboratory research.'
    },
    'prod-kpv10mg': {
      name: 'KPV 10mg',
      short_description: 'Tripeptide fragment of alpha-MSH for anti-inflammatory signaling and antimicrobial research.',
      description: 'KPV (Lysine-Proline-Valine) represents the C-terminal tripeptide sequence of alpha-Melanocyte Stimulating Hormone (alpha-MSH). Studied in NF-kB inhibition and epithelial cellular homeostasis.',
      disclaimer: 'For in vitro laboratory research use only. Not for human application.',
      acknowledgment_text: 'I confirm this peptide is strictly for in vitro laboratory analysis.'
    },
    'prod-dsip10mg': {
      name: 'DSIP 10mg',
      short_description: 'Delta Sleep-Inducing Peptide nonapeptide standard for neuroendocrine and circadian research.',
      description: 'DSIP is a 9-amino acid neuromodulatory peptide discovered in cerebral venous blood. Used in research regarding slow-wave delta EEG synchronization and neuro-hormonal regulation.',
      disclaimer: 'For in vitro research use only. Not for human use.',
      acknowledgment_text: 'I confirm that this compound is strictly for laboratory research.'
    },
    'prod-glp3rt20mg': {
      name: 'GLP3-RT 20mg (Triple Agonist High Yield)',
      short_description: 'High-yield 20mg formulation of GIP/GLP-1/Glucagon tri-agonist standard for high-throughput screening.',
      description: 'Lyophilized 20mg preparation of triple incretin receptor agonist GLP3-RT for multi-well assay titration, receptor affinity profiling, and mass spectrometry calibration.',
      disclaimer: 'For in vitro screening and research only. Not for clinical use.',
      acknowledgment_text: 'I acknowledge that this peptide is strictly for in vitro laboratory research.'
    },
    'prod-semx10mg': {
      name: 'Semax 10mg',
      short_description: 'Heptapeptide ACTH(4-10) analogue for BDNF expression and neuroprotective pathway assays.',
      description: 'Semax (Met-Glu-His-Phe-Pro-Gly-Pro) is a synthetic regulatory peptide derived from ACTH fragment. Extensively analyzed for neurotrophin upregulation (BDNF, TrkB) in neuronal cultures.',
      disclaimer: 'For in vitro laboratory research use only. Not for human or animal application.',
      acknowledgment_text: 'I confirm that Semax is purchased strictly for laboratory research.'
    },
    'prod-epit5mg': {
      name: 'Epitalon 5mg',
      short_description: 'Synthetic tetrapeptide (Ala-Glu-Asp-Gly) for telomerase activation and cellular aging research.',
      description: 'Epitalon (Epithalon) is a synthetic tetrapeptide modeled after the pineal gland peptide Epithalamin. Studied in cellular senescence assays, telomerase expression, and chromatin remodeling.',
      disclaimer: 'For in vitro research use only. Not for human administration.',
      acknowledgment_text: 'I confirm that Epitalon is strictly for in vitro scientific research.'
    },
    'prod-impa10mg': {
      name: 'Ipamorelin 10mg',
      short_description: 'Selective growth hormone secretagogue pentapeptide for pituitary receptor kinetic assays.',
      description: 'Ipamorelin is a pentapeptide (Aib-His-D-2-Nal-D-Phe-Lys-NH2) that selectively binds to the ghrelin/growth hormone secretagogue receptor (GHS-R1a) without stimulating cortisol or prolactin.',
      disclaimer: 'For in vitro laboratory research use only. Not for clinical or diagnostic use.',
      acknowledgment_text: 'I confirm this compound is purchased exclusively for in vitro research.'
    },
    'prod-epit10mg': {
      name: 'Epitalon 10mg',
      short_description: 'High-concentration Epitalon tetrapeptide standard for telomere biology and cell longevity assays.',
      description: 'Lyophilized 10mg standard of Epitalon (Ala-Glu-Asp-Gly). Engineered for multi-assay protocols examining telomere length preservation, antioxidant enzyme activity, and cellular longevity.',
      disclaimer: 'For in vitro laboratory research only. Not for human or veterinary use.',
      acknowledgment_text: 'I acknowledge that Epitalon is strictly for scientific research.'
    },
    'prod-semo10mg': {
      name: 'Sermorelin 10mg',
      short_description: 'GHRH(1-29) amide peptide standard for growth hormone axis and pituitary cell culture studies.',
      description: 'Sermorelin is a 29-amino acid peptide comprising the functional N-terminal fragment of endogenous human growth hormone-releasing hormone. High purity verified by analytical RP-HPLC.',
      disclaimer: 'For in vitro laboratory research use only. Not for human consumption.',
      acknowledgment_text: 'I confirm that Sermorelin is strictly for laboratory research.'
    },
    'prod-pt14110mg': {
      name: 'PT-141 10mg (Bremelanotide)',
      short_description: 'Synthetic cyclic heptapeptide melanocortin receptor agonist for central nervous system assays.',
      description: 'PT-141 (Bremelanotide) is a cyclic heptapeptide analogue of alpha-MSH acting as an agonist at central melanocortin MC3 and MC4 receptors. Analyzed for neurochemical and behavioral modeling.',
      disclaimer: 'For in vitro research use only. Not for human or animal application.',
      acknowledgment_text: 'I confirm that PT-141 is strictly for in vitro laboratory analysis.'
    },
    'prod-ss3110mg': {
      name: 'SS-31 10mg (Elamipretide)',
      short_description: 'Mitochondria-targeting antioxidant tetrapeptide for cardiolipin binding and ATP bioenergetics research.',
      description: 'SS-31 (Elamipretide / D-Arg-Dmt-Lys-Phe-NH2) is a synthetic tetrapeptide that selectively targets the inner mitochondrial membrane, stabilizing cardiolipin and preventing electron leak in vitro.',
      disclaimer: 'For in vitro laboratory research use only. Not for human administration.',
      acknowledgment_text: 'I acknowledge that SS-31 is strictly for laboratory research.'
    },
    'prod-kiss10mg': {
      name: 'Kisspeptin-10 10mg',
      short_description: 'Decapeptide KISS1 receptor agonist for GnRH pulse regulation and reproductive neuroendocrine research.',
      description: 'Kisspeptin-10 is the minimal bioactive C-terminal decapeptide derived from the KISS1 precursor protein. Functions as a potent agonist at the GPR54 (KISS1R) receptor in endocrine pathway research.',
      disclaimer: 'For in vitro laboratory research use only. Not for clinical administration.',
      acknowledgment_text: 'I confirm that Kisspeptin is strictly for in vitro scientific research.'
    }
  },

  ar: {
    'prod-tesam10mg': {
      name: 'تيساموريلين 10 ملغ (Tesamorelin)',
      short_description: 'نظير ببتيدي صناعي لهرمون GHRH مصمم لأبحاث هرمون النمو والتمثيل الغذائي المخبري.',
      description: 'تيساموريلين هو نظير صناعي لهرمون إفراز هرمون النمو (GHRH) يتكون من 44 حمضاً أمينياً مع مجموعة هيكسينويل مرتبطة بالنهاية النيتروجينية. تم إنتاجه وتصنيعه وفق أعلى معايير الجودة الصيدلانية cGMP للتحليل المخبري المتقدم.',
      disclaimer: 'للاستخدام في البحوث المخبرية وأنابيب الاختبار فقط (in vitro). غير مخصص للاستخدام البشري أو البيطري.',
      acknowledgment_text: 'أقر بأن هذا المركب الكيميائي مخصص حصرياً للبحوث والتجارب المخبرية.'
    },
    'prod-nad500mg': {
      name: 'إن إيه دي بلس 500 ملغ (NAD+ 500mg)',
      short_description: 'نيكوتيناميد أدينين دينوكليوتيد فائق النقاء لأبحاث طاقة الميتوكوندريا وإنزيمات السيرتوين.',
      description: 'NAD+ هو إنزيم مساعد أساسي في جميع الخلايا الحية، ويلعب دوراً مركزياً في تفاعلات الأكسدة والاختزال الخلوي والفسفرة التأكسدية والتحكم في التعبير الجيني عبر مسارات السيرتوين.',
      disclaimer: 'للبحوث المخبرية والمعايرة التحليلية فقط. غير مخصص للاستخدام التشخيصي أو العلاجي.',
      acknowledgment_text: 'أؤكد أن هذه المادة مخصصة حصرياً للاختبارات والتحليلات المخبرية.'
    },
    'prod-motsc10mg': {
      name: 'موتس-سي 10 ملغ (MOTS-c 10mg)',
      short_description: 'ببتيد مشتق من الميتوكوندريا (MDP) لأبحاث الإشارات الأيضية ومسارات تنظيم الأنسولين.',
      description: 'موتس-سي هو ببتيد مكون من 16 حمضاً أمينياً مشفر داخل الحمض النووي الريبوزي 12S للميتوكوندريا. يُدرس في أبحاث المرونة الأيضية وتفعيل مسار AMPK الخلوي.',
      disclaimer: 'للاستخدام البحثي في المختبرات فقط. غير مخصص للاستهلاك البشري.',
      acknowledgment_text: 'أؤكد أن هذا الطلب مخصص حصرياً للأبحاث العلمية المخبرية.'
    },
    'prod-ghkcu100mg': {
      name: 'جي إتش كيه-نحاس 100 ملغ (GHK-Cu 100mg)',
      short_description: 'مركب ببتيد النحاس الثلاثي عالي النقاء لدراسات تجديد الأنسجة وتخليق الكولاجين.',
      description: 'GHK-Cu هو مركب ببتيدي طبيعي يرتبط بالنحاس يُستخدم في دراسات النسيج خارج الخلية وتخليق الكولاجين والتعبير الجيني في المزارع الخلوية.',
      disclaimer: 'لأبحاث المختبرات في أنابيب الاختبار فقط. غير مخصص للاستخدام التجميلي أو البشري.',
      acknowledgment_text: 'أؤكد أن هذا المركب مخصص تماماً للأبحاث المخبرية.'
    },
    'prod-bpc15710mg': {
      name: 'بي بي سي-157 10 ملغ (BPC-157 10mg)',
      short_description: 'ببتيد خماسي عشري صناعي لأبحاث تجديد الأنسجة والأوتار والحماية الخلوية المخبرية.',
      description: 'BPC-157 هو ببتيد يتكون من 15 حمضاً أمينياً مشتق من بروتينات العصارة المعدية. تمت دراسته بشكل مكثف في مسارات تكوين الأوعية الدموية وتعبير VEGF وإصلاح الأنسجة الرخوة.',
      disclaimer: 'للبحوث المخبرية فقط (in vitro). غير مخصص للعلاج البشري أو البيطري.',
      acknowledgment_text: 'أقر بأن BPC-157 مخصص حصرياً للتجارب والبحوث المخبرية.'
    },
    'prod-bac500ml': {
      name: 'ماء كابح للبكتيريا 500 مل معقم (BAC Water)',
      short_description: 'محلول كابح للبكتيريا معقم مصمم لإعادة حل الببتيدات بنسبة 0.9% كحول بنزيلي معتمد.',
      description: 'ماء كابح للبكتيريا لإعادة حل وتجهيز المحاليل المخبرية، يحتوي على 0.9% كحول بنزيلي نقي كمادة حافظة مضادة للميكروبات، مفلتر عبر أغشية معقمة 0.22 ميكرون.',
      disclaimer: 'لإعادة حل الكواشف المخبرية فقط. غير مخصص للحقن الوريدي أو الاستخدام الطبي للإنسان.',
      acknowledgment_text: 'أؤكد أن هذا الكاشف مخصص فقط لإعادة التشكيل المخبري.'
    },
    'prod-glp3rt10mg': {
      name: 'جي إل بي 3-آر تي 10 ملغ (محفز ثلاثي المستقبِلات)',
      short_description: 'معيار ببتيدي ثلاثي التأثير (GIP / GLP-1 / Glucagon) لأبحاث مسارات الأيض والسكري.',
      description: 'GLP3-RT (نظير ريتاتروتايد) هو ببتيد أحادي الهيكل يتميز بفاعلية متوازنة على مستقبلات GIP و GLP-1 والجلوكاجون، مصنع لأبحاث ألفة المستقبلات الخلوية.',
      disclaimer: 'لأبحاث المستقبلات والتحليل المخبري فقط. يمنع منعاً باتاً للاستخدام البشري.',
      acknowledgment_text: 'أقر بأن هذا المركب الثلاثي مخصص حصرياً للبحث العلمي.'
    },
    'prod-wolver10mg': {
      name: 'خليط ولفيرين 10 ملغ (BPC-157 + TB-500)',
      short_description: 'مزيج ببتيدي ثنائي متكامل يجمع BPC-157 (5 ملغ) مع TB-500 (5 ملغ) لدراسات الأنسجة.',
      description: 'يجمع هذا المزيج المتوازن نسب متساوية من BPC-157 و ثيموسين بيتا-4 (TB-500) لدراسات التآزر الكيميائي وإصلاح النسيج الضام خارج الخلية في المختبر.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للعلاج البشري أو الحيواني.',
      acknowledgment_text: 'أؤكد أن هذا الخليط مخصص حصرياً للأبحاث المخبرية.'
    },
    'prod-ipm1295nd10mg': {
      name: 'خليط CJC-1295 (بدون DAC) مع إيباموريلين 10 ملغ',
      short_description: 'مزيج مجفف بالتجميد من محفزات إفراز هرمون النمو (5 ملغ / 5 ملغ) لأبحاث الغدد الصماء.',
      description: 'تركيبة بحثية متكافئة تجمع CJC-1295 المعدل مع ببتيد إيباموريلين الخماسي لدراسة حركية مستقبلات الغدة النخامية في البيئات المخبرية.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للاستخدام البشري.',
      acknowledgment_text: 'أقر بأن هذا المزيج مخصص فقط للبحث العلمي.'
    },
    'prod-tb50010mg': {
      name: 'تي بي-500 10 ملغ (ثيموسين بيتا-4)',
      short_description: 'ببتيد صناعي مكون من 43 حمضاً أمينياً لدراسات بلمرة الأكتين وهجرة الخلايا.',
      description: 'TB-500 هو مشتق صناعي من بروتين ثيموسين بيتا-4 المنظم للأكتين، ويُدرس بشكل واسع في ديناميكية حركة الخلايا وتجدد الأنسجة المخبرية.',
      disclaimer: 'للاستخدام في البحوث المخبرية فقط. ليس للاستخدام البشري أو البيطري.',
      acknowledgment_text: 'أقر بأن TB-500 مخصص حصرياً للبحث المخبري.'
    },
    'prod-kpv10mg': {
      name: 'كيه بي في 10 ملغ (KPV 10mg)',
      short_description: 'ببتيد ثلاثي من هرمون ألفا-MSH لأبحاث تثبيط الالتهاب ومضادات الميكروبات.',
      description: 'KPV (ليسين-برولين-فالين) يمثل النهاية الثلاثية لهرمون تحفيز الخلايا الصباغية ألفا، ويدرس لتأثيراته في تثبيط مسار NF-kB والتوازن الخلوي.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للاستخدام البشري.',
      acknowledgment_text: 'أؤكد أن هذا الببتيد مخصص للتحليل المخبري فقط.'
    },
    'prod-dsip10mg': {
      name: 'دي إس آي بي 10 ملغ (ببتيد تحفيز النوم دلتا)',
      short_description: 'ببتيد تساعي لدراسات الغدد الصم العصبية والإيقاع البيولوجي اليومي.',
      description: 'DSIP هو ببتيد معدل عصبي مكون من 9 أحماض أمينية يُستخدم في أبحاث التزامن الدماغي لموجات دلتا والتنظيم الهرموني العصبي.',
      disclaimer: 'للبحوث المخبرية فقط. ليس للاستخدام البشري.',
      acknowledgment_text: 'أؤكد أن هذا المركب مخصص للبحث العلمي في المختبر.'
    },
    'prod-glp3rt20mg': {
      name: 'جي إل بي 3-آر تي 20 ملغ (تركيز عالي)',
      short_description: 'تركيز مضاعف 20 ملغ من معيار المحفز الثلاثي لإجراء الفحوصات المخبرية عالية الإنتاجية.',
      description: 'تحضير مجفف بالتجميد عالي النقاء لمعايرة الفحوصات متعددة الآبار ودراسات ألفة المستقبِلات والتحليل الطيفي الكتلي.',
      disclaimer: 'للفحوصات والبحوث المخبرية فقط. غير مخصص للاستخدام السريري.',
      acknowledgment_text: 'أقر بأن هذه المادة مخصصة للأبحاث المخبرية.'
    },
    'prod-semx10mg': {
      name: 'سيماكس 10 ملغ (Semax 10mg)',
      short_description: 'نظير ببتيدي سباعي مشتق من ACTH لأبحاث التعبير عن عامل BDNF والحماية العصبية.',
      description: 'سيماكس هو ببتيد تنظيمي صناعي يُحلل في مزارع الخلايا العصبية لدراسة تحفيز عوامل التغذية العصبية مثل BDNF ومستقبلات TrkB.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للتطبيق البشري أو الحيواني.',
      acknowledgment_text: 'أؤكد أن سيماكس تم شراؤه حصرياً للبحث المخبري.'
    },
    'prod-epit5mg': {
      name: 'إبيتالون 5 ملغ (Epitalon 5mg)',
      short_description: 'ببتيد رباعي صناعي لدراسات تنشيط إنزيم التيلوميراز وشيخوخة الخلايا.',
      description: 'إبيتالون هو ببتيد رباعي صناعي مصمم بناءً على ببتيد الغدة الصنوبرية، ويُدرس في اختبارات هرم الخلايا وتعبير التيلوميراز وتنظيم الكروماتين.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للإعطاء البشري.',
      acknowledgment_text: 'أؤكد أن إبيتالون مخصص حصرياً للبحث العلمي.'
    },
    'prod-impa10mg': {
      name: 'إيباموريلين 10 ملغ (Ipamorelin 10mg)',
      short_description: 'ببتيد خماسي انتقائي لإفراز هرمون النمو لدراسات حركية مستقبلات الغدة النخامية.',
      description: 'إيباموريلين ببتيد خماسي يرتبط بشكل انتقائي بمستقبل هرمون النمو (GHS-R1a) دون تحفيز هرمونات الكورتيزول أو البرولاكتين في الخلايا.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للاستخدام السريري.',
      acknowledgment_text: 'أؤكد أن هذا المركب مخصص لأبحاث المختبر فقط.'
    },
    'prod-epit10mg': {
      name: 'إبيتالون 10 ملغ (Epitalon 10mg تركيز عالي)',
      short_description: 'معيار ببتيدي مركز لدراسات بيولوجيا التيلومير وطول عمر الخلايا المخبرية.',
      description: 'معيار مجفف بالتجميد عالي النقاء 10 ملغ من إبيتالون مصمم لبروتوكولات الفحص المتعددة التي تدرس الحفاظ على طول التيلومير والإنزيمات المضادة للأكسدة.',
      disclaimer: 'لأبحاث المختبرات فقط. ليس للاستخدام البشري أو البيطري.',
      acknowledgment_text: 'أقر بأن إبيتالون مخصص للأبحاث العلمية فقط.'
    },
    'prod-semo10mg': {
      name: 'سيرموريلين 10 ملغ (Sermorelin 10mg)',
      short_description: 'معيار ببتيدي لنظير هرمون GHRH(1-29) لدراسات محور هرمون النمو والخلايا النخامية.',
      description: 'سيرموريلين ببتيد مكون من 29 حمضاً أمينياً يمثل الجزء النشط لهرمون إفراز النمو الطبيعي، تم التحقق من نقاوته بواسطة كروماتوغرافيا HPLC.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للاستهلاك البشري.',
      acknowledgment_text: 'أؤكد أن سيرموريلين مخصص للبحوث المخبرية فقط.'
    },
    'prod-pt14110mg': {
      name: 'بي تي-141 10 ملغ (بريميلانوتيد PT-141)',
      short_description: 'ببتيد حلقي سباعي محفز لمستقبلات الميلانوكورتين لأبحاث الجهاز العصبي المركزي.',
      description: 'PT-141 هو نظير حلقي لهرمون ألفا-MSH يعمل كمحفز لمستقبلات الميلانوكورتين المركزية MC3 و MC4، ويُدرس في النمذجة السلوكية والكيميائية العصبية.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للاستخدام البشري.',
      acknowledgment_text: 'أؤكد أن PT-141 مخصص للتحليل المخبري فقط.'
    },
    'prod-ss3110mg': {
      name: 'إس إس-31 10 ملغ (إيلاميبريتيد SS-31)',
      short_description: 'ببتيد رباعي مضاد للأكسدة يستهدف الميتوكوندريا ويرتبط بالكارديوليبين لأبحاث الطاقة الخلوية.',
      description: 'SS-31 هو ببتيد رباعي صناعي يستهدف بشكل انتقائي الغشاء الداخلي للميتوكوندريا، مما يثبت الكارديوليبين ويمنع تسرب الإلكترونات في بيئات الاختبار المخبرية.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للإعطاء البشري.',
      acknowledgment_text: 'أقر بأن SS-31 مخصص للبحث المخبري فقط.'
    },
    'prod-kiss10mg': {
      name: 'كيسببتين-10 10 ملغ (Kisspeptin-10)',
      short_description: 'ببتيد عشري محفز لمستقبل KISS1 لأبحاث إفراز هرمون GnRH والمسارات الهرمونية التناسلية.',
      description: 'كيسببتين-10 هو الببتيد العشري النشط المشتق من بروتين KISS1، ويعمل كمحفز قوي لمستقبل GPR54 في أبحاث مسارات الغدد الصم والتكاثر.',
      disclaimer: 'للبحوث المخبرية فقط. غير مخصص للإعطاء السريري.',
      acknowledgment_text: 'أؤكد أن كيسببتين مخصص للبحث العلمي في أنابيب الاختبار.'
    }
  },

  es: {
    'prod-tesam10mg': {
      name: 'Tesamorelina 10mg',
      short_description: 'Análogo sintético del péptido GHRH para la investigación de la pulsátil del crecimiento y metabolismo.',
      description: 'La tesamorelina es un análogo sintético de la hormona liberadora de la hormona del crecimiento (GHRH) de 44 aminoácidos con fracción hexenoilo N-terminal. Fabricado bajo cGMP para análisis de laboratorio.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para uso humano ni veterinario.',
      acknowledgment_text: 'Reconozco que este compuesto químico se adquiere exclusivamente para investigación de laboratorio.'
    },
    'prod-nad500mg': {
      name: 'NAD+ 500mg (Nicotinamida Adenina Dinucleótido)',
      short_description: 'Dinucleótido de nicotinamida y adenina ultrapuro para bioenergética mitocondrial y ensayos de sirtuinas.',
      description: 'NAD+ es una coenzima esencial presente en todas las células vivas, fundamental en reacciones redox celulares, fosforilación oxidativa y regulación epigenética mediada por sirtuinas.',
      disclaimer: 'Solo para investigación y calibración analítica de laboratorio. No apto para diagnóstico clínico.',
      acknowledgment_text: 'Confirmo que esta sustancia es estrictamente para pruebas analíticas de laboratorio.'
    },
    'prod-motsc10mg': {
      name: 'MOTS-c 10mg',
      short_description: 'Estándar de péptido derivado de mitocondrias (MDP) para señalización metabólica e insulina.',
      description: 'MOTS-c es un péptido de 16 aminoácidos codificado en el gen del ARNr 12S mitocondrial. Investigado en plasticidad metabólica celular y fosforilación de AMPK.',
      disclaimer: 'Solo para investigación in vitro. No para consumo humano.',
      acknowledgment_text: 'Confirmo que esta compra está estrictamente destinada a la investigación científica de laboratorio.'
    },
    'prod-ghkcu100mg': {
      name: 'GHK-Cu 100mg (Tripéptido de Cobre)',
      short_description: 'Complejo de tripéptido de cobre de alta pureza para remodelación dérmica y síntesis de colágeno.',
      description: 'GHK-Cu es un complejo peptídico natural de unión a cobre examinado en la síntesis de matriz extracelular, remodelación de colágeno y expresión génica.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para aplicación cosmética o humana.',
      acknowledgment_text: 'Confirmo que este compuesto químico es estrictamente para investigación de laboratorio.'
    },
    'prod-bpc15710mg': {
      name: 'BPC-157 10mg',
      short_description: 'Secuencia pentadecapeptídica para regeneración tisular, ensayos de tendones y citoprotección celular.',
      description: 'BPC-157 es un péptido de 15 aminoácidos derivado de la proteína del jugo gástrico. Estudiado en angiogénesis, expresión de VEGF y reparación de tejidos blandos.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para uso terapéutico humano o veterinario.',
      acknowledgment_text: 'Reconozco que BPC-157 es estrictamente para investigación de laboratorio in vitro.'
    },
    'prod-bac500ml': {
      name: 'Agua Bacteriostática 500ml (Estéril)',
      short_description: 'Vehículo de reconstitución estéril formulado con 0.9% de alcohol bencílico grado USP.',
      description: 'Agua bacteriostática para reconstitución de laboratorio con alcohol bencílico USP al 0.9% como conservante antimicrobiano. Filtrada estéril por membrana de 0.22 micras.',
      disclaimer: 'Solo para reconstitución de reactivos de laboratorio. No apto para inyección parenteral humana.',
      acknowledgment_text: 'Confirmo que este reactivo se compra exclusivamente para reconstitución en laboratorio.'
    },
    'prod-glp3rt10mg': {
      name: 'GLP3-RT 10mg (Triple Agonista GIP/GLP-1/Glucagón)',
      short_description: 'Estándar tri-agonista para investigación de receptores metabólicos y rutas incretínicas.',
      description: 'GLP3-RT (análogo de retatrutida) es una estructura peptídica con agonismo balanceado en receptores GIP, GLP-1 y glucagón para ensayos de unión molecular.',
      disclaimer: 'Solo para ensayos de receptores y análisis de laboratorio in vitro. Prohibido su uso humano.',
      acknowledgment_text: 'Reconozco que este compuesto tri-agonista es estrictamente para investigación de laboratorio.'
    },
    'prod-wolver10mg': {
      name: 'Wolverine Blend 10mg (BPC-157 + TB-500)',
      short_description: 'Mezcla sinérgica de investigación de BPC-157 (5mg) y TB-500 (5mg) para ensayos de reparación tisular.',
      description: 'Combina proporciones iguales de 5mg de BPC-157 y Timosina Beta-4 (TB-500) para estudios comparativos de matriz extracelular y secuestro de actina in vitro.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para uso terapéutico en humanos o animales.',
      acknowledgment_text: 'Confirmo que esta mezcla es estrictamente para investigación de ensayos de laboratorio.'
    },
    'prod-ipm1295nd10mg': {
      name: 'CJC-1295 (Sin DAC) / Ipamorelina 10mg Mezcla',
      short_description: 'Mezcla co-liofilizada de secretagogos GHRH y Ghrelina (5mg / 5mg) para investigación endocrina.',
      description: 'Formulación sinérgica 1:1 de CJC-1295 modificado e Ipamorelina para estudios de cinética de receptores somatotrópicos in vitro.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para administración humana.',
      acknowledgment_text: 'Reconozco que esta mezcla secretagoga es estrictamente para investigación científica.'
    },
    'prod-tb50010mg': {
      name: 'TB-500 10mg (Timosina Beta-4)',
      short_description: 'Péptido sintético de 43 aminoácidos para polimerización de actina y migración celular.',
      description: 'TB-500 es un derivado sintético de la Timosina Beta-4 reguladora de actina, investigado en cinéticas de migración celular y cicatrización.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para uso humano ni veterinario.',
      acknowledgment_text: 'Reconozco que TB-500 es estrictamente para investigación de laboratorio.'
    },
    'prod-kpv10mg': {
      name: 'KPV 10mg',
      short_description: 'Fragmento tripéptido de alfa-MSH para señalización antiinflamatoria e investigación antimicrobiana.',
      description: 'KPV representa la secuencia tripéptida C-terminal de alfa-MSH. Estudiado en inhibición de NF-kB y homeostasis epitelial.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para uso humano.',
      acknowledgment_text: 'Confirmo que este péptido es estrictamente para análisis de laboratorio in vitro.'
    },
    'prod-dsip10mg': {
      name: 'DSIP 10mg (Péptido Inductor del Sueño Delta)',
      short_description: 'Estándar nonapéptido para investigación neuroendocrina y ritmos circadianos.',
      description: 'DSIP es un péptido neuromodulador de 9 aminoácidos empleado en la sincronización EEG de ondas lentas y regulación neurohormonal.',
      disclaimer: 'Solo para investigación in vitro. No para uso humano.',
      acknowledgment_text: 'Confirmo que este compuesto es estrictamente para investigación de laboratorio.'
    },
    'prod-glp3rt20mg': {
      name: 'GLP3-RT 20mg (Triple Agonista Alto Rendimiento)',
      short_description: 'Formulación de 20mg de triple agonista para cribado de alta capacidad y titulación de ensayos.',
      description: 'Preparación liofilizada de 20mg del tri-agonista GLP3-RT para análisis multicanal y calibración espectrométrica.',
      disclaimer: 'Solo para cribado e investigación in vitro. No para uso clínico.',
      acknowledgment_text: 'Reconozco que este péptido es estrictamente para investigación de laboratorio in vitro.'
    },
    'prod-semx10mg': {
      name: 'Semax 10mg',
      short_description: 'Análogo heptapeptídico de ACTH(4-10) para ensayos de BDNF y rutas neuroprotectoras.',
      description: 'Semax es un péptido regulador sintético derivado del fragmento ACTH analizado en cultivos neuronales para la regulación positiva de BDNF y TrkB.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para aplicación humana ni animal.',
      acknowledgment_text: 'Confirmo que Semax se adquiere estrictamente para investigación de laboratorio.'
    },
    'prod-epit5mg': {
      name: 'Epitalon 5mg',
      short_description: 'Tetrapéptido sintético para activación de telomerasa y estudios de senescencia celular.',
      description: 'Epitalon es un tetrapéptido sintético basado en el péptido pineal Epitalamina, estudiado en ensayos de envejecimiento celular y expresión de telomerasa.',
      disclaimer: 'Solo para investigación in vitro. No para administración humana.',
      acknowledgment_text: 'Confirmo que Epitalon es estrictamente para investigación científica in vitro.'
    },
    'prod-impa10mg': {
      name: 'Ipamorelina 10mg',
      short_description: 'Pentapéptido secretagogo selectivo de la hormona de crecimiento para ensayos cinéticos hipofisarios.',
      description: 'La ipamorelina es un pentapéptido que se une selectivamente al receptor GHS-R1a sin estimular el cortisol ni la prolactina.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para uso clínico.',
      acknowledgment_text: 'Confirmo que este compuesto se adquiere exclusivamente para investigación in vitro.'
    },
    'prod-epit10mg': {
      name: 'Epitalon 10mg (Alta Concentración)',
      short_description: 'Estándar concentrado de Epitalon para biología telomérica y longevidad celular in vitro.',
      description: 'Estándar liofilizado de 10mg para protocolos analíticos que examinan la preservación del telómero y la actividad enzimática antioxidante.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para uso humano ni veterinario.',
      acknowledgment_text: 'Reconozco que Epitalon es estrictamente para investigación científica.'
    },
    'prod-semo10mg': {
      name: 'Sermorelina 10mg',
      short_description: 'Estándar peptídico GHRH(1-29) para estudios del eje somatotropo y cultivos celulares.',
      description: 'La sermorelina comprende el fragmento N-terminal funcional de la GHRH endógena, con pureza verificada por RP-HPLC.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para consumo humano.',
      acknowledgment_text: 'Confirmo que la Sermorelina es estrictamente para investigación de laboratorio.'
    },
    'prod-pt14110mg': {
      name: 'PT-141 10mg (Bremelanotida)',
      short_description: 'Agonista peptídico cíclico del receptor de melanocortina para ensayos del sistema nervioso central.',
      description: 'PT-141 es un análogo cíclico de alfa-MSH que actúa en receptores centrales MC3 y MC4 para modelado neuroquímico y de conducta.',
      disclaimer: 'Solo para investigación in vitro. No para uso humano.',
      acknowledgment_text: 'Confirmo que PT-141 es estrictamente para análisis de laboratorio in vitro.'
    },
    'prod-ss3110mg': {
      name: 'SS-31 10mg (Elamipretida)',
      short_description: 'Tetrapéptido antioxidante mitocondrial para unión a cardiolipina y bioenergética de ATP.',
      description: 'SS-31 se dirige selectivamente a la membrana mitocondrial interna, estabilizando la cardiolipina y previniendo la fuga de electrones in vitro.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para administración humana.',
      acknowledgment_text: 'Reconozco que SS-31 es estrictamente para investigación de laboratorio.'
    },
    'prod-kiss10mg': {
      name: 'Kisspeptina-10 10mg',
      short_description: 'Decapéptido agonista del receptor KISS1 para regulación de pulsos de GnRH y neuroendocrinología.',
      description: 'Kisspeptina-10 es el decapéptido bioactivo derivado de la proteína KISS1 que actúa sobre el receptor GPR54 en vías endocrinas reproductivas.',
      disclaimer: 'Solo para investigación de laboratorio in vitro. No para uso clínico.',
      acknowledgment_text: 'Confirmo que la Kisspeptina es estrictamente para investigación científica in vitro.'
    }
  },

  fr: {
    'prod-tesam10mg': {
      name: 'Tésamoréline 10mg',
      short_description: 'Analogue peptidique synthétique de la GHRH pour la recherche sur l\'hormone de croissance et le métabolisme.',
      description: 'La tésamoréline est un analogue synthétique de l\'hormone de libération de l\'hormone de croissance (GHRH) comprenant 44 acides aminés avec un groupe hexénoyle à l\'extrémité N-terminale.',
      disclaimer: 'Strictement réservé à la recherche en laboratoire in vitro. Non destiné à l\'administration humaine ou vétérinaire.',
      acknowledgment_text: 'Je reconnais que ce composé chimique est acheté exclusivement pour la recherche en laboratoire.'
    },
    'prod-nad500mg': {
      name: 'NAD+ 500mg (Nicotinamide Adénine Dinucléotide)',
      short_description: 'Coenzyme ultra-pure pour la bioénergétique mitochondriale et les dosages de sirtuines.',
      description: 'Le NAD+ est une coenzyme essentielle présente dans toutes les cellules vivantes, au cœur des réactions redox cellulaires et de la régulation épigénétique médiée par les sirtuines.',
      disclaimer: 'Pour la recherche en laboratoire et l\'étalonnage analytique uniquement.',
      acknowledgment_text: 'Je confirme que cette substance est strictement destinée aux analyses de laboratoire.'
    },
    'prod-motsc10mg': {
      name: 'MOTS-c 10mg',
      short_description: 'Peptide d\'origine mitochondriale (MDP) pour les voies de signalisation métabolique et d\'insuline.',
      description: 'MOTS-c est un peptide de 16 acides aminés codé dans l\'ARN 12S mitochondrial, étudié dans la plasticité métabolique et l\'activation de la voie AMPK.',
      disclaimer: 'Réservé à la recherche in vitro. Non destiné à la consommation humaine.',
      acknowledgment_text: 'Je confirme que cet achat est strictement destiné à la recherche scientifique en laboratoire.'
    },
    'prod-ghkcu100mg': {
      name: 'GHK-Cu 100mg (Tripeptide de Cuivre)',
      short_description: 'Complexe tripeptide de cuivre de haute pureté pour le remodelage tissulaire et la synthèse du collagène.',
      description: 'GHK-Cu est un complexe naturel liant le cuivre analysé dans la synthèse de la matrice extracellulaire, le remodelage du collagène et l\'expression génique.',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement. Non destiné à un usage cosmétique ou humain.',
      acknowledgment_text: 'Je confirme que ce composé chimique est strictement destiné à la recherche en laboratoire.'
    },
    'prod-bpc15710mg': {
      name: 'BPC-157 10mg',
      short_description: 'Séquence pentadécapeptidique pour la régénération tissulaire et la cytoprotection cellulaire in vitro.',
      description: 'BPC-157 est un peptide de 15 acides aminés dérivé de la protéine du suc gastrique, étudié dans l\'angiogenèse, l\'expression du VEGF et la réparation des tissus mous.',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement. Non destiné à un usage thérapeutique.',
      acknowledgment_text: 'Je reconnais que le BPC-157 est strictement destiné à la recherche en laboratoire.'
    },
    'prod-bac500ml': {
      name: 'Eau Bactériostatique 500ml (Stérile)',
      short_description: 'Véhicule de reconstitution stérile formulé avec 0,9 % d\'alcool benzylique de qualité USP.',
      description: 'Eau bactériostatique stérile pour la reconstitution de réactifs de laboratoire, filtrée sur membrane 0,22 micron en salle blanche certifiée.',
      disclaimer: 'Pour la reconstitution de réactifs de laboratoire uniquement. Non injectable chez l\'homme.',
      acknowledgment_text: 'Je confirme que ce réactif est acheté exclusivement pour la reconstitution en laboratoire.'
    },
    'prod-glp3rt10mg': {
      name: 'GLP3-RT 10mg (Triple Agoniste)',
      short_description: 'Standard tri-agoniste GIP/GLP-1/Glucagon pour l\'étude des récepteurs métaboliques et des incrétines.',
      description: 'GLP3-RT (analogue de retatrutide) présente une activité équilibrée sur les récepteurs GIP, GLP-1 et glucagon pour les tests de liaison moléculaire.',
      disclaimer: 'Réservé aux dosages de récepteurs et à la recherche analytique in vitro. Usage humain interdit.',
      acknowledgment_text: 'Je reconnais que ce composé tri-agoniste est strictement destiné à la recherche en laboratoire.'
    },
    'prod-wolver10mg': {
      name: 'Wolverine Blend 10mg (BPC-157 + TB-500)',
      short_description: 'Mélange synergique de BPC-157 (5mg) et TB-500 (5mg) pour les études de réparation tissulaire.',
      description: 'Combine des ratios égaux de 5mg de BPC-157 et de Thymosine Bêta-4 pour les études in vitro de matrice extracellulaire.',
      disclaimer: 'Réservé à la recherche en laboratoire in vitro. Non destiné à un usage thérapeutique.',
      acknowledgment_text: 'Je confirme que ce mélange est strictement destiné aux tests de laboratoire.'
    },
    'prod-ipm1295nd10mg': {
      name: 'CJC-1295 (Sans DAC) / Ipamoréline 10mg Mélange',
      short_description: 'Mélange co-lyophilisé de sécrétagogues GHRH et ghréline (5mg / 5mg) pour la recherche endocrinienne.',
      description: 'Formulation synergique 1:1 de CJC-1295 sans DAC et d\'Ipamoréline pour la cinétique des récepteurs somatotropes in vitro.',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement. Non destiné à l\'administration humaine.',
      acknowledgment_text: 'Je reconnais que ce mélange est strictement destiné à la recherche scientifique.'
    },
    'prod-tb50010mg': {
      name: 'TB-500 10mg (Thymosine Bêta-4)',
      short_description: 'Peptide synthétique de 43 acides aminés pour l\'étude de la polymérisation de l\'actine et de la migration cellulaire.',
      description: 'Dérivé synthétique de la Thymosine Bêta-4 régulatrice d\'actine, étudié dans la cicatrisation et la dynamique cellulaire in vitro.',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement.',
      acknowledgment_text: 'Je reconnais que le TB-500 est strictement réservé à la recherche en laboratoire.'
    },
    'prod-kpv10mg': {
      name: 'KPV 10mg',
      short_description: 'Fragment tripeptide de l\'alpha-MSH pour les voies de signalisation anti-inflammatoires.',
      description: 'KPV représente la séquence tripeptidique C-terminale de l\'alpha-MSH, analysée dans l\'inhibition de NF-kB et l\'homéostasie épithéliale.',
      disclaimer: 'Réservé à la recherche en laboratoire in vitro.',
      acknowledgment_text: 'Je confirme que ce peptide est strictement destiné aux analyses de laboratoire.'
    },
    'prod-dsip10mg': {
      name: 'DSIP 10mg (Peptide Inducteur du Sommeil Delta)',
      short_description: 'Standard nonapeptidique pour la recherche neuroendocrinienne et les rythmes circadiens.',
      description: 'DSIP est un peptide neuromodulateur de 9 acides aminés utilisé dans l\'étude de la synchronisation des ondes lentes EEG.',
      disclaimer: 'Pour la recherche in vitro uniquement. Non destiné à un usage humain.',
      acknowledgment_text: 'Je confirme que ce composé est strictement destiné à la recherche en laboratoire.'
    },
    'prod-glp3rt20mg': {
      name: 'GLP3-RT 20mg (Triple Agoniste Haute Concentration)',
      short_description: 'Formulation 20mg de standard tri-agoniste pour le criblage à haut débit et les titrages.',
      description: 'Préparation lyophilisée de 20mg du tri-agoniste GLP3-RT pour le profilage d\'affinité des récepteurs et l\'étalonnage LC-MS.',
      disclaimer: 'Réservé au criblage et à la recherche in vitro.',
      acknowledgment_text: 'Je reconnais que ce peptide est strictement réservé à la recherche en laboratoire.'
    },
    'prod-semx10mg': {
      name: 'Semax 10mg',
      short_description: 'Analogue heptapeptidique d\'ACTH(4-10) pour l\'expression du BDNF et la neuroprotection in vitro.',
      description: 'Semax est un peptide régulateur synthétique analysé dans les cultures neuronales pour la régulation positive des neurotrophines (BDNF, TrkB).',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement.',
      acknowledgment_text: 'Je confirme que le Semax est acheté strictement pour la recherche en laboratoire.'
    },
    'prod-epit5mg': {
      name: 'Epitalon 5mg',
      short_description: 'Tétrapeptide synthétique pour l\'activation de la télomérase et l\'étude du vieillissement cellulaire.',
      description: 'Epitalon est un tétrapeptide synthétique modélisé d\'après l\'Epithalamine pinéale, étudié dans les essais de sénescence cellulaire.',
      disclaimer: 'Pour la recherche in vitro uniquement. Non injectable chez l\'homme.',
      acknowledgment_text: 'Je confirme que l\'Epitalon est strictement réservé à la recherche scientifique in vitro.'
    },
    'prod-impa10mg': {
      name: 'Ipamoréline 10mg',
      short_description: 'Pentapeptide sécrétagogue sélectif de l\'hormone de croissance pour la cinétique hypophysaire.',
      description: 'L\'ipamoréline se lie sélectivement au récepteur GHS-R1a sans induire de pic de cortisol ou de prolactine in vitro.',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement.',
      acknowledgment_text: 'Je confirme que ce composé est acheté exclusivement pour la recherche in vitro.'
    },
    'prod-epit10mg': {
      name: 'Epitalon 10mg (Haute Concentration)',
      short_description: 'Standard concentré d\'Epitalon pour la biologie télomérique et la longévité cellulaire.',
      description: 'Standard lyophilisé de 10mg pour les protocoles examinant la préservation de la longueur des télomères et les enzymes antioxydantes.',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement.',
      acknowledgment_text: 'Je reconnais que l\'Epitalon est strictement réservé à la recherche scientifique.'
    },
    'prod-semo10mg': {
      name: 'Sermoréline 10mg',
      short_description: 'Standard peptidique GHRH(1-29) pour les études de l\'axe somatotrope et cultures hypophysaires.',
      description: 'La sermoréline comprend le fragment N-terminal fonctionnel de la GHRH humaine endogène, avec pureté validée par RP-HPLC.',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement.',
      acknowledgment_text: 'Je confirme que la Sermoréline est strictement destinée à la recherche en laboratoire.'
    },
    'prod-pt14110mg': {
      name: 'PT-141 10mg (Brémélanotide)',
      short_description: 'Agoniste peptidique cyclique des récepteurs de la mélanocortine pour la recherche sur le SNC.',
      description: 'PT-141 est un analogue cyclique d\'alpha-MSH ciblant les récepteurs centraux MC3 et MC4 pour la modélisation neurochimique.',
      disclaimer: 'Pour la recherche in vitro uniquement. Usage humain interdit.',
      acknowledgment_text: 'Je confirme que le PT-141 est strictement réservé aux analyses de laboratoire.'
    },
    'prod-ss3110mg': {
      name: 'SS-31 10mg (Elamiprétide)',
      short_description: 'Tétrapeptide antioxydant ciblant les mitochondries pour la liaison à la cardiolipine et la bioénergétique de l\'ATP.',
      description: 'SS-31 cible sélectivement la membrane mitochondriale interne en stabilisant la cardiolipine et en évitant les fuites d\'électrons in vitro.',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement.',
      acknowledgment_text: 'Je reconnais que le SS-31 est strictement réservé à la recherche en laboratoire.'
    },
    'prod-kiss10mg': {
      name: 'Kisspeptine-10 10mg',
      short_description: 'Décapeptide agoniste du récepteur KISS1 pour la régulation des impulsions de GnRH et la neuroendocrinologie.',
      description: 'La kisspeptine-10 est le décapeptide bioactif dérivé de la protéine KISS1 agissant puissamment sur le récepteur GPR54 (KISS1R).',
      disclaimer: 'Pour la recherche en laboratoire in vitro uniquement.',
      acknowledgment_text: 'Je confirme que la Kisspeptine est strictement réservée à la recherche scientifique.'
    }
  },

  de: {
    'prod-tesam10mg': {
      name: 'Tesamorelin 10mg',
      short_description: 'Synthetisches GHRH-Analogon-Peptid für die Erforschung der Wachstumshormon-Pulsatilität und des Stoffwechsels.',
      description: 'Tesamorelin ist ein synthetisches Analogon des Wachstumshormon-Releasing-Hormons (GHRH), bestehend aus 44 Aminosäuren mit einer N-terminalen Hexenoylgruppe. Hergestellt unter cGMP-Bedingungen für Laboranalysen.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für den menschlichen oder veterinärmedizinischen Gebrauch.',
      acknowledgment_text: 'Ich bestätige, dass diese chemische Substanz ausschließlich für die In-vitro-Laborforschung erworben wird.'
    },
    'prod-nad500mg': {
      name: 'NAD+ 500mg (Nicotinamid-Adenin-Dinukleotid)',
      short_description: 'Ultra-reines Nicotinamid-Adenin-Dinukleotid für mitochondriale Bioenergetik und Sirtuin-Assays.',
      description: 'NAD+ ist ein essentielles Coenzym aller lebenden Zellen und zentral für zelluläre Redoxreaktionen, oxidative Phosphorylierung und Sirtuin-vermittelte epigenetische Regulation.',
      disclaimer: 'Ausschließlich für Laboranalysen und Kalibrierungen. Nicht für die klinische Diagnostik bestimmt.',
      acknowledgment_text: 'Ich bestätige, dass diese Substanz streng für analytische Laboruntersuchungen bestimmt ist.'
    },
    'prod-motsc10mg': {
      name: 'MOTS-c 10mg',
      short_description: 'Mitochondrial abgeleiteter Peptidstandard (MDP) für metabolische Signal- und Insulinregulationsstudien.',
      description: 'MOTS-c ist ein Peptid aus 16 Aminosäuren, das im mitochondrialen 12S-rRNA-Gen kodiert ist. Untersucht in zellulärer metabolischer Plastizität und AMPK-Phosphorylierung.',
      disclaimer: 'Ausschließlich für In-vitro-Forschungszwecke. Nicht für den menschlichen Verzehr.',
      acknowledgment_text: 'Ich bestätige, dass dieser Erwerb ausschließlich für wissenschaftliche Laborforschung bestimmt ist.'
    },
    'prod-ghkcu100mg': {
      name: 'GHK-Cu 100mg (Kupfer-Tripeptid)',
      short_description: 'Hochreiner Kupfer-Tripeptid-Komplex für dermale Geweberegeneration und Kollagensynthese-Assays.',
      description: 'GHK-Cu ist ein natürlicher kupferbindender Peptidkomplex, der in der Synthese der extrazellulären Matrix, der Kollagenbildung und Genexpressionsstudien untersucht wird.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für kosmetische oder menschliche Anwendungen.',
      acknowledgment_text: 'Ich bestätige, dass diese chemische Verbindung streng für die Laborforschung bestimmt ist.'
    },
    'prod-bpc15710mg': {
      name: 'BPC-157 10mg',
      short_description: 'Synthetische Pentadecapeptid-Sequenz für Geweberegeneration, Sehnenassays und zellulären Zytoschutz.',
      description: 'BPC-157 ist ein 15-Aminosäure-Peptid, das aus menschlichem Magensaftprotein abgeleitet ist. Untersucht in Angiogenese, VEGF-Expression und Weichteilreparatur.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für therapeutische Zwecke.',
      acknowledgment_text: 'Ich bestätige, dass BPC-157 streng für die In-vitro-Laborforschung bestimmt ist.'
    },
    'prod-bac500ml': {
      name: 'Bakteriostatisches Wasser 500ml (Steril)',
      short_description: 'Steriles bakteriostatisches Rekonstitutionsmedium mit 0,9 % Benzylalkohol in USP-Qualität.',
      description: 'Bakteriostatisches Wasser für die Labor-Rekonstitution mit 0,9 % Benzylalkohol als antimikrobiellem Konservierungsmittel. 0,22-Mikron sterilfiltriert im Reinraum.',
      disclaimer: 'Ausschließlich zur Rekonstitution von Laborreagenzien. Nicht zur parenteralen Injektion beim Menschen.',
      acknowledgment_text: 'Ich bestätige, dass dieses Reagenz ausschließlich für die Rekonstitution im Labor bestimmt ist.'
    },
    'prod-glp3rt10mg': {
      name: 'GLP3-RT 10mg (Dreifach-Agonist)',
      short_description: 'Dreifach wirkender GIP/GLP-1/Glukagon-Rezeptor-Triagonist-Standard für die Stoffwechselforschung.',
      description: 'GLP3-RT (Retatrutid-Referenzanalogon) ist ein Peptid mit ausgewogener Bindung an GIP-, GLP-1- und Glukagon-Rezeptoren für Bindungs- und Incretin-Assays.',
      disclaimer: 'Ausschließlich für In-vitro-Rezeptorassays und Laboranalysen. Für den Menschen strengstens verboten.',
      acknowledgment_text: 'Ich bestätige, dass diese Dreifach-Agonisten-Substanz ausschließlich für die Laborforschung bestimmt ist.'
    },
    'prod-wolver10mg': {
      name: 'Wolverine Blend 10mg (BPC-157 + TB-500)',
      short_description: 'Synergistische Dual-Peptid-Mischung aus BPC-157 (5mg) und TB-500 (5mg) für Gewebereparaturstudien.',
      description: 'Kombiniert gleiche 5mg-Anteile von BPC-157 und Thymosin Beta-4 für vergleichende Studien der extrazellulären Matrix und Aktin-Sequestrierung in vitro.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für therapeutische Zwecke geeignet.',
      acknowledgment_text: 'Ich bestätige, dass diese Mischung streng für Laboruntersuchungen bestimmt ist.'
    },
    'prod-ipm1295nd10mg': {
      name: 'CJC-1295 (Ohne DAC) / Ipamorelin 10mg Mischung',
      short_description: 'Co-lyophilisierte GHRH- und Ghrelin-Rezeptor-Sekretagoga-Mischung (5mg / 5mg) für endokrine Studien.',
      description: 'Eine synergistische 1:1-Forschungsformulierung aus modifiziertem CJC-1295 und Ipamorelin für die Somatotrop-Rezeptorkinetik in vitro.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht zur Verabreichung am Menschen.',
      acknowledgment_text: 'Ich bestätige, dass diese Sekretagoga-Mischung ausschließlich für die wissenschaftliche Forschung bestimmt ist.'
    },
    'prod-tb50010mg': {
      name: 'TB-500 10mg (Thymosin Beta-4)',
      short_description: 'Synthetisches 43-Aminosäuren-Peptid für Aktinpolymerisation und zelluläre Migrationsstudien.',
      description: 'TB-500 ist ein synthetisches Derivat des aktinregulierenden Thymosin Beta-4, untersucht in Zellmigration und Wundheilungskinetik in vitro.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für Mensch oder Tier.',
      acknowledgment_text: 'Ich bestätige, dass TB-500 ausschließlich für die Laborforschung bestimmt ist.'
    },
    'prod-kpv10mg': {
      name: 'KPV 10mg',
      short_description: 'Tripeptidfragment von alpha-MSH für entzündungshemmende Signal- und antimikrobielle Forschung.',
      description: 'KPV stellt die C-terminale Tripeptidsequenz von alpha-MSH dar und wird auf NF-kB-Hemmung und epitheliale Zellhomöostase untersucht.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung.',
      acknowledgment_text: 'Ich bestätige, dass dieses Peptid streng für Laboranalysen bestimmt ist.'
    },
    'prod-dsip10mg': {
      name: 'DSIP 10mg (Delta Sleep-Inducing Peptide)',
      short_description: 'Nonapeptid-Standard für neuroendokrine und zirkadiane Rhythmusstudien.',
      description: 'DSIP ist ein neuromodulatorisches 9-Aminosäuren-Peptid für Studien zur Slow-Wave-Delta-EEG-Synchronisation und neurohormonellen Steuerung.',
      disclaimer: 'Ausschließlich für In-vitro-Forschungszwecke. Nicht für den Menschen bestimmt.',
      acknowledgment_text: 'Ich bestätige, dass diese Substanz ausschließlich für die Laborforschung bestimmt ist.'
    },
    'prod-glp3rt20mg': {
      name: 'GLP3-RT 20mg (Dreifach-Agonist Hochkonzentriert)',
      short_description: 'Hochkonzentrierte 20mg-Formulierung des Tri-Agonisten für High-Throughput-Screening.',
      description: 'Lyophilisierte 20mg-Präparation des Dreifach-Incretin-Agonisten GLP3-RT für Mikrotiter-Assays und Massenspektrometrie-Kalibrierungen.',
      disclaimer: 'Ausschließlich für In-vitro-Screening und Laborforschung.',
      acknowledgment_text: 'Ich bestätige, dass dieses Peptid ausschließlich für die In-vitro-Laborforschung bestimmt ist.'
    },
    'prod-semx10mg': {
      name: 'Semax 10mg',
      short_description: 'Heptapeptid-ACTH(4-10)-Analogon für BDNF-Expressions- und Neuroprotektionsstudien.',
      description: 'Semax ist ein synthetisches regulatorisches Peptid, das in neuronalen Zellkulturen auf die Hochregulation von Neurotrophinen (BDNF, TrkB) untersucht wird.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für Mensch oder Tier.',
      acknowledgment_text: 'Ich bestätige, dass Semax ausschließlich für die Laborforschung erworben wird.'
    },
    'prod-epit5mg': {
      name: 'Epitalon 5mg',
      short_description: 'Synthetisches Tetrapeptid für Telomerase-Aktivierung und zelluläre Alterungsforschung.',
      description: 'Epitalon ist ein synthetisches Tetrapeptid nach dem Vorbild des Zirbeldrüsenpeptids Epithalamin, untersucht in Zellalterung und Telomerase-Expression.',
      disclaimer: 'Ausschließlich für In-vitro-Forschungszwecke. Nicht für die Verabreichung am Menschen.',
      acknowledgment_text: 'Ich bestätige, dass Epitalon ausschließlich für die wissenschaftliche In-vitro-Forschung bestimmt ist.'
    },
    'prod-impa10mg': {
      name: 'Ipamorelin 10mg',
      short_description: 'Selektives Wachstumshormon-Sekretagogum-Pentapeptid für hypophysäre Rezeptorkinetik.',
      description: 'Ipamorelin bindet selektiv an den GHS-R1a-Rezeptor, ohne Cortisol oder Prolaktin in vitro anzuregen.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für klinische Zwecke.',
      acknowledgment_text: 'Ich bestätige, dass diese Verbindung ausschließlich für In-vitro-Forschungszwecke bestimmt ist.'
    },
    'prod-epit10mg': {
      name: 'Epitalon 10mg (Hochkonzentriert)',
      short_description: 'Hochkonzentrierter Epitalon-Standard für Telomerbiologie und zelluläre Langlebigkeit in vitro.',
      description: 'Lyophilisierter 10mg-Standard von Epitalon für Multi-Assay-Protokolle zur Telomerlängenerhaltung und antioxidativen Enzymaktivität.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für Mensch oder Tier.',
      acknowledgment_text: 'Ich bestätige, dass Epitalon streng für die wissenschaftliche Forschung bestimmt ist.'
    },
    'prod-semo10mg': {
      name: 'Sermorelin 10mg',
      short_description: 'GHRH(1-29)-Peptidstandard für somatotrope Achsen- und Hypophysen-Zellkulturstudien.',
      description: 'Sermorelin umfasst das funktionelle N-terminale Fragment des körpereigenen humanen GHRH. Reinheit durch RP-HPLC verifiziert.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für den Verzehr.',
      acknowledgment_text: 'Ich bestätige, dass Sermorelin ausschließlich für die Laborforschung bestimmt ist.'
    },
    'prod-pt14110mg': {
      name: 'PT-141 10mg (Bremelanotid)',
      short_description: 'Synthetischer zyklischer Heptapeptid-Melanocortin-Rezeptor-Agonist für ZNS-Studien.',
      description: 'PT-141 ist ein zyklisches Analogon von alpha-MSH, das an zentralen MC3- und MC4-Rezeptoren für neurochemische Modellierungen untersucht wird.',
      disclaimer: 'Ausschließlich für In-vitro-Forschungszwecke. Nicht für die Verabreichung am Menschen.',
      acknowledgment_text: 'Ich bestätige, dass PT-141 ausschließlich für Laboranalysen bestimmt ist.'
    },
    'prod-ss3110mg': {
      name: 'SS-31 10mg (Elamipretid)',
      short_description: 'Mitochondrien-gerichtetes antioxidatives Tetrapeptid für Cardiolipin-Bindung und ATP-Bioenergetik.',
      description: 'SS-31 zielt selektiv auf die innere Mitochondrienmembran ab, stabilisiert Cardiolipin und verhindert Elektronenverlust in vitro.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für den Menschen.',
      acknowledgment_text: 'Ich bestätige, dass SS-31 streng für die Laborforschung bestimmt ist.'
    },
    'prod-kiss10mg': {
      name: 'Kisspeptin-10 10mg',
      short_description: 'Decapeptid-KISS1-Rezeptoragonist für GnRH-Pulsregulation und reproduktive Neuroendokrinologie.',
      description: 'Kisspeptin-10 ist das minimale bioaktive Decapeptid aus dem KISS1-Vorläuferprotein und fungiert als potenter Agonist am GPR54-Rezeptor.',
      disclaimer: 'Ausschließlich für die In-vitro-Laborforschung. Nicht für die klinische Anwendung.',
      acknowledgment_text: 'Ich bestätige, dass Kisspeptin ausschließlich für die wissenschaftliche In-vitro-Forschung bestimmt ist.'
    }
  }
};

export const CUSTOM_PAGE_TRANSLATIONS: Record<LanguageCode, Record<string, CustomPageLocalizedFields>> = {
  en: {
    'page-about': {
      title: 'About BK Research Labs',
      category: 'General',
      summary: 'Our scientific mission, analytical purity benchmarks, and institutional supply standards.',
      content: `## Institutional Science & High-Purity Synthesis\n\nBK Research Labs is a specialized supplier of certified reference compounds and laboratory consumables engineered exclusively for in vitro academic and biomedical research.\n\n### Analytical Rigor & HPLC Standards\nEvery compound batch undergoes third-party high-performance liquid chromatography (HPLC) and mass spectrometry (LC-MS) testing to verify purity levels exceeding 99.0%. Analytical Certificates of Analysis (COAs) are generated on a lot-specific basis and made directly accessible in our COA Vault.\n\n### Cold-Chain Logistics\nTemperature-sensitive reagents are packaged in insulated thermal barrier shippers with solid CO2 dry ice or cold gel packs to maintain biochemical integrity during transit.\n\n### In Vitro Research Compliance\nAll materials supplied by BK Research Labs are strictly intended for in vitro laboratory research and scientific calibration. Materials are not for human, clinical, therapeutic, or diagnostic administration.`
    },
    'page-quality': {
      title: 'Quality Assurance & HPLC Verification',
      category: 'Scientific',
      summary: 'Lot-by-lot analytical verification, mass spectrometry testing, and analytical standards.',
      content: `## Quality Assurance & Verification Protocols\n\nAt BK Research Labs, analytical integrity is our foundation. We maintain strict compliance with standardized analytical testing procedures across every compound synthesis run.\n\n### Comprehensive Testing Workflow\n1. **Purity Determination (HPLC):** High-Performance Liquid Chromatography separates and quantifies chemical components, establishing purity against reference standards.\n2. **Identity Confirmation (LC-MS / MALDI-TOF):** Mass spectrometry verifies exact molecular mass and confirms peptide or small molecule chemical identity without degradation artifacts.\n3. **Sterility & Endotoxin Screening:** Finished lyophilized vials undergo strict bioburden screening before final lot release.\n4. **Lot Tracking QR Codes:** Scan the 2D QR code on any vial to instantly view its verified Certificate of Analysis.`
    },
    'page-reconstitution-guide': {
      title: 'Reconstitution & Storage Protocols',
      category: 'Protocol',
      summary: 'Standard laboratory handling, sterile dilution steps, and cold storage parameters.',
      content: `## Laboratory Reconstitution & Handling Protocols\n\n### Lyophilized Powder Storage\n- **Unopened Vials:** Store desiccated at -20°C for long-term stability (up to 24 months), or 2°C to 8°C for short-term handling.\n- Protect from direct ultraviolet exposure and moisture.\n\n### Reconstitution Procedure\n1. Allow the lyophilized vial to reach room temperature (20°C - 25°C) before reconstitution to prevent atmospheric condensation.\n2. Clean the rubber septum with a sterile 70% isopropyl alcohol wipe.\n3. Using a sterile laboratory syringe, gently introduce bacteriostatic water or sterile analytical buffer down the internal glass wall.\n4. **Do not vortex or vigorously shake.** Gently swirl the vial in circular motions until the lyophilized pellet is completely dissolved into a clear solution.\n\n### Reconstituted Solution Storage\n- Store reconstituted solutions at 2°C to 8°C and utilize within recommended laboratory experimental timelines (typically 21-28 days).\n- For extended storage, aliquot into single-use cryovials and freeze at -80°C to prevent freeze-thaw degradation cycles.`
    },
    'page-compliance-terms': {
      title: 'Terms of Research Supply & Legal Disclaimers',
      category: 'Legal',
      summary: 'Institutional supply agreements, in vitro research constraints, and compliance mandates.',
      content: `## Terms of Laboratory Supply & Compliance Disclaimer\n\n### Research Use Only (RUO) Notice\nAll products, chemical compounds, and analytical reference standards supplied by BK Research Labs are engineered and distributed strictly for in vitro laboratory research, academic study, and assay development.\n\n### Prohibited Uses\n- **Not for Human or Veterinary Administration:** Under no circumstances are products intended for clinical, therapeutic, household, agricultural, or diagnostic use in humans or animals.\n- **Buyer Qualifications:** The purchaser represents and warrants that laboratory facilities have adequate safety protocols, personal protective equipment (PPE), and qualified personnel to handle experimental chemical compounds.\n\n### Age & Geographic Verification\nPurchases are strictly restricted to authorized entities and individuals aged 21 or older who have verified scientific research intent.`
    }
  },

  ar: {
    'page-about': {
      title: 'عن مختبرات بي كيه للأبحاث (BK Research Labs)',
      category: 'عام',
      summary: 'مهمتنا العلمية، معايير النقاء التحليلي، وبروتوكولات التوريد المؤسسي للمختبرات.',
      content: `## العلوم المؤسسية والتخليق الكيميائي فائق النقاء\n\nتعد مختبرات بي كيه للأبحاث مورداً متخصصاً للمركبات المرجعية المعتمدة والمستهلكات المخبرية المصممة حصرياً للأبحاث الأكاديمية والطبية الحيوية في أنابيب الاختبار (in vitro).\n\n### الدقة التحليلية ومعايير HPLC\nتخضع كل دفعة مركبات لاختبارات كروماتوغرافيا السائل عالية الأداء (HPLC) ومطياف الكتلة (LC-MS) من طرف ثالث للتحقق من مستويات نقاء تتجاوز 99.0%. يتم إنشاء شهادات التحليل التحليلي (COA) على أساس كل دفعة وتوفيرها مباشرة في خزينة الشهادات الخاصة بنا.\n\n### لوجستيات سلسلة التبريد المعزولة\nيتم تغليف الكواشف الحساسة لدرجة الحرارة في حاويات عازلة حرارياً مع الثلج الجاف CO2 الصلب أو عبوات التبريد الهلامية للحفاظ على السلامة الكيميائية الحيوية أثناء النقل السريع.\n\n### الامتثال لأبحاث أنابيب الاختبار (in vitro)\nجميع المواد التي توفرها مختبراتنا مخصصة بدقة للبحوث المخبرية والمعايرة العلمية، وليست مخصصة للاستخدام البشري أو السريري أو البيطري أو العلاجي.`
    },
    'page-quality': {
      title: 'ضمان الجودة والتحقق التحليلي عبر HPLC',
      category: 'علمي',
      summary: 'التحقق التحليلي دفعة بدفعة، واختبارات مطيافية الكتلة، ومعايير الجودة الدولية.',
      content: `## بروتوكولات ضمان الجودة والتحقق العلمي\n\nفي مختبرات بي كيه للأبحاث، النزاهة التحليلية هي حجر الأساس. نحن نلتزم بأعلى معايير وإجراءات الفحص والتحليل القياسية عبر كل مراحل التخليق الكيميائي.\n\n### مراحل سير العمل والتحليل الشامل\n1. **تحديد النقاء (HPLC):** تفصل كروماتوغرافيا السائل عالية الأداء المكونات الكيميائية وتقيسها لتحديد درجة النقاء مقابل المعايير المرجعية الدولية.\n2. **تأكيد الهوية الجزيئية (LC-MS / MALDI-TOF):** يؤكد مطياف الكتلة الوزن الجزيئي الدقيق وهوية الببتيد أو المركب دون أي شوائب تفكك.\n3. **فحص التعقيم والسموم الداخلية:** تخضع العبوات المجففة بالتجميد لفحص دقيق للتلوث الحيوي قبل الإفراج عن الدفعة.\n4. **رموز الاستجابة السريعة (QR) لتتبع الدفعات:** امسح رمز QR ثنائي الأبعاد على أي قارورة للاطلاع الفوري على شهادة التحليل المعتمدة.`
    },
    'page-reconstitution-guide': {
      title: 'بروتوكولات إعادة التشكيل والتخزين المخبري',
      category: 'بروتوكول',
      summary: 'التعامل المخبري القياسي، خطوات التخفيف المعقم، ومعايير التخزين البارد.',
      content: `## بروتوكولات التخفيف وإعادة الحل المخبري\n\n### تخزين المساحيق المجففة بالتجميد (Lyophilized)\n- **القوارير غير المفتوحة:** تُحفظ في بيئة جافة عند -20 درجة مئوية للاستقرار طويل الأمد (حتى 24 شهراً)، أو بين 2 إلى 8 درجات مئوية للاستخدام قصير المدى.\n- يجب الحماية من الأشعة فوق البنفسجية المباشرة والرطوبة.\n\n### خطوات وإجراءات إعادة التشكيل\n1. اترك القارورة لتصل إلى درجة حرارة الغرفة (20-25 مئوية) قبل الحل لمنع التكثف الجوي الداخلي.\n2. عقم الحاجز المطاطي بمسحة كحول أيزوبروبيل 70% معقمة.\n3. باستخدام حقنة مخبرية معقمة، أضف الماء الكابح للبكتيريا أو المحلول الدارئ المعقم ببطء على الجدار الزجاجي الداخلي للقارورة.\n4. **لا ترج القارورة بعنف أو تستخدم جهاز الفورتكس.** حرك القارورة بحركات دائرية هادئة ولطيفة حتى يذوب المسحوق تماماً ويصبح المحلول صافياً.\n\n### حفظ وتخزين المحاليل بعد التشكيل\n- تُحفظ المحاليل المعاد تشكيلها في درجة حرارة 2 إلى 8 درجات مئوية وتستخدم خلال الجداول التجريبية الموصى بها (عادة من 21 إلى 28 يوماً).\n- للتخزين الممتد، قسم المحلول إلى أنابيب تبريد أحادية الاستخدام وجمدها عند -80 درجة مئوية لتجنب دورات التجميد والذوبان المتكررة.`
    },
    'page-compliance-terms': {
      title: 'شروط التوريد البحثي وإخلاء المسؤولية القانونية',
      category: 'قانوني',
      summary: 'اتفاقيات التوريد المؤسسي، ضوابط أبحاث أنابيب الاختبار، والتراخيص المعتمدة.',
      content: `## شروط التوريد المخبري والامتثال التنظيمي\n\n### إشعار الاستخدام البحثي فقط (RUO)\nجميع المنتجات والمركبات الكيميائية والمعايير المرجعية التحليلية التي توفرها مختبرات بي كيه للأبحاث مصممة وموزعة حصرياً لأغراض **البحوث المخبرية في أنابيب الاختبار، والدراسات الأكاديمية، وتطوير المقايسات العلمية**.\n\n### الاستخدامات المحظورة والممنوعة قطيعاً\n- **غير مخصص للاستخدام البشري أو البيطري:** يمنع منعاً باتاً استخدام هذه المواد سريرياً أو علاجياً أو منزلياً أو زراعياً أو تشخيصياً للإنسان أو الحيوان.\n- **مؤهلات المشتري:** يقر المشتري ويتعهد بأن المنشأة المخبرية تمتلك بروتوكولات سلامة كافية، ومعدات حماية شخصية (PPE)، وكوادر علمية مؤهلة للتعامل مع المركبات الكيميائية التجريبية.\n\n### التحقق من العمر والأهلية القانونية\nتقتصر المشتريات بشكل صارم على الهيئات والباحثين المرخصين الذين تبلغ أعمارهم 21 عاماً أو أكثر مع نية بحثية علمية مثبتة ومحققة.`
    }
  },

  es: {
    'page-about': {
      title: 'Acerca de BK Research Labs',
      category: 'General',
      summary: 'Nuestra misión científica, pureza analítica y estándares de suministro institucional.',
      content: `## Ciencia Institucional y Síntesis de Alta Pureza\n\nBK Research Labs es un proveedor especializado de compuestos de referencia certificados y consumibles de laboratorio diseñados exclusivamente para la investigación biomédica y académica in vitro.\n\n### Rigor Analítico y Estándares HPLC\nCada lote de compuestos se somete a pruebas de cromatografía líquida de alta resolución (HPLC) y espectrometría de masas (LC-MS) de terceros para verificar purezas superiores al 99.0%. Los Certificados de Análisis (COA) se generan por lote y están disponibles en nuestra Bóveda de COA.\n\n### Logística de Cadena de Frío\nLos reactivos sensibles a la temperatura se empaquetan en contenedores térmicos con hielo seco de CO2 sólido o geles refrigerantes para mantener la integridad bioquímica.\n\n### Cumplimiento para Investigación In Vitro\nTodos los materiales son estrictamente para investigación de laboratorio in vitro y calibración científica. No para administración humana, clínica o veterinaria.`
    },
    'page-quality': {
      title: 'Garantía de Calidad y Verificación HPLC',
      category: 'Científico',
      summary: 'Verificación analítica lote por lote, espectrometría de masas y estándares de calidad.',
      content: `## Protocolos de Garantía de Calidad y Verificación\n\nEn BK Research Labs, la integridad analítica es nuestro pilar fundamental. Cumplimos con rigurosos procedimientos de ensayo estandarizados en cada síntesis.\n\n### Flujo de Análisis Integral\n1. **Determinación de Pureza (HPLC):** Cuantifica los componentes químicos y verifica la pureza frente a estándares de referencia.\n2. **Confirmación de Identidad (LC-MS / MALDI-TOF):** Verifica la masa molecular exacta y confirma la identidad sin artefactos de degradación.\n3. **Cribado de Esterilidad y Endotoxinas:** Los viales liofilizados se someten a estrictos análisis microbiológicos antes de su liberación.\n4. **Códigos QR de Trazabilidad:** Escanee el código QR en cualquier vial para consultar de inmediato su Certificado de Análisis validado.`
    },
    'page-reconstitution-guide': {
      title: 'Protocolos de Reconstitución y Almacenamiento',
      category: 'Protocolo',
      summary: 'Manejo estándar en laboratorio, dilución estéril y parámetros de conservación en frío.',
      content: `## Protocolos de Reconstitución y Manipulación en Laboratorio\n\n### Almacenamiento del Polvo Liofilizado\n- **Viales sin abrir:** Almacenar desecados a -20°C para estabilidad prolongada (hasta 24 meses), o de 2°C a 8°C para uso a corto plazo.\n- Proteger de la luz ultravioleta y de la humedad.\n\n### Procedimiento de Reconstitución\n1. Dejar que el vial alcance la temperatura ambiente (20°C - 25°C) antes de la reconstitución.\n2. Limpiar el tapón de goma con una toallita estéril de alcohol isopropílico al 70%.\n3. Con una jeringa estéril de laboratorio, introducir suavemente agua bacteriostática por la pared de cristal interior.\n4. **No agitar vigorosamente ni usar vórtex.** Girar suavemente el vial en círculos hasta que el liofilizado se disuelva completamente.\n\n### Conservación de Soluciones Reconstituidas\n- Conservar entre 2°C y 8°C y utilizar dentro de los plazos recomendados (normalmente 21-28 días).\n- Para almacenamiento prolongado, alicuotar en crioviales estériles y congelar a -80°C.`
    },
    'page-compliance-terms': {
      title: 'Términos de Suministro de Investigación y Descargo Legal',
      category: 'Legal',
      summary: 'Acuerdos de suministro institucional, limitaciones in vitro y normativas aplicables.',
      content: `## Términos de Suministro y Cumplimiento Normativo\n\n### Aviso de Uso Exclusivo para Investigación (RUO)\nTodos los productos y estándares químicos suministrados por BK Research Labs se distribuyen estrictamente para **investigación de laboratorio in vitro, estudios académicos y desarrollo de ensayos**.\n\n### Usos Prohibidos\n- **No para administración humana o veterinaria:** En ningún caso los productos están destinados a usos clínicos, terapéuticos, domésticos o diagnósticos.\n- **Cualificación del comprador:** El comprador declara que sus instalaciones cuentan con protocolos de seguridad, equipo de protección individual (EPI) y personal cualificado.\n\n### Verificación de Edad y Entidad\nLas compras están estrictamente restringidas a entidades autorizadas e investigadores de 21 años o más con fines de investigación científica acreditados.`
    }
  },

  fr: {
    'page-about': {
      title: 'À Propos de BK Research Labs',
      category: 'Général',
      summary: 'Notre mission scientifique, nos critères de pureté et nos normes institutionnelles.',
      content: `## Science Institutionnelle et Synthèse de Haute Pureté\n\nBK Research Labs est un fournisseur spécialisé de composés de référence certifiés et de consommables de laboratoire destinés exclusivement à la recherche biomédicale et académique in vitro.\n\n### Rigueur Analytique et Normes HPLC\nChaque lot subit des analyses tierces par HPLC et spectrométrie de masse (LC-MS) pour garantir une pureté supérieure à 99,0 %. Les certificats d'analyse (COA) sont générés par lot et accessibles dans notre coffre-fort de COA.\n\n### Logistique de Chaîne du Froid\nLes réactifs thermosensibles sont conditionnés dans des emballages isothermes avec carboglace CO2 ou accumulateurs de froid.\n\n### Conformité pour la Recherche In Vitro\nTous les produits sont strictement réservés à la recherche en laboratoire in vitro et à l'étalonnage scientifique. Non destinés à un usage humain ou vétérinaire.`
    },
    'page-quality': {
      title: 'Assurance Qualité & Vérification HPLC',
      category: 'Scientifique',
      summary: 'Contrôles analytiques lot par lot, spectrométrie de masse et normes de pureté.',
      content: `## Protocoles d'Assurance Qualité et de Vérification\n\nChez BK Research Labs, l'intégrité analytique est notre priorité. Nous appliquons des procédures normalisées à chaque synthèse.\n\n### Processus d'Analyse Approfondi\n1. **Pureté par HPLC :** Sépare et quantifie les fractions chimiques pour certifier le niveau de pureté.\n2. **Confirmation Moléculaire (LC-MS) :** Valide la masse moléculaire exacte et l'identité chimique du peptide.\n3. **Contrôle de Stérilité & Endotoxines :** Dépistage rigoureux avant toute libération de lot.\n4. **Traçabilité par QR Code :** Scannez le code QR sur le flacon pour consulter instantanément le certificat d'analyse.`
    },
    'page-reconstitution-guide': {
      title: 'Protocoles de Reconstitution et de Stockage',
      category: 'Protocole',
      summary: 'Manipulation en laboratoire, dilution stérile et conservation à basse température.',
      content: `## Protocoles de Reconstitution et de Manipulation en Laboratoire\n\n### Stockage des Poudres Lyophilisées\n- **Flacons non ouverts :** Conserver à -20°C pour une stabilité maximale (jusqu'à 24 mois), ou de 2°C à 8°C pour un usage à court terme.\n- Protéger des rayons UV et de l'humidité.\n\n### Procédure de Reconstitution\n1. Laisser le flacon revenir à température ambiante (20°C - 25°C) avant reconstitution.\n2. Désinfecter l'opercule avec une compresse stérile d'alcool isopropylique à 70%.\n3. Injecter lentement l'eau bactériostatique le long de la paroi interne en verre.\n4. **Ne pas agiter vigoureusement.** Faire tourner doucement le flacon d'un mouvement circulaire jusqu'à dissolution complète.\n\n### Conservation des Solutions Reconstituées\n- Conserver entre 2°C et 8°C et utiliser dans les délais recommandés (21 à 28 jours).\n- Pour une conservation prolongée, fractionner en cryotubes et congeler à -80°C.`
    },
    'page-compliance-terms': {
      title: 'Conditions de Fourniture pour la Recherche & Mentions Légales',
      category: 'Légal',
      summary: 'Accords institutionnels, limites d\'usage in vitro et exigences réglementaires.',
      content: `## Conditions Générales de Fourniture et Avertissements\n\n### Usage Réservé à la Recherche (RUO)\nTous les produits et standards fournis par BK Research Labs sont strictement réservés à la **recherche en laboratoire in vitro et au développement de dosages scientifiques**.\n\n### Usages Strictement Interdits\n- **Non destiné à l'usage humain ou vétérinaire :** Les produits ne doivent en aucun cas être administrés à des fins thérapeutiques, cliniques ou diagnostiques.\n- **Qualifications de l'acheteur :** L'acheteur garantit disposer d'infrastructures équipées, d'EPI et de personnel scientifique qualifié.\n\n### Vérification de l'Âge et des Autorisations\nLes commandes sont strictement réservées aux entités autorisées et aux chercheurs âgés d'au moins 21 ans justifiant d'un projet de recherche scientifique.`
    }
  },

  de: {
    'page-about': {
      title: 'Über BK Research Labs',
      category: 'Allgemein',
      summary: 'Unsere wissenschaftliche Mission, Reinheitsstandards und institutionelle Lieferrichtlinien.',
      content: `## Institutionelle Wissenschaft & Hochreine Synthese\n\nBK Research Labs ist ein spezialisierter Anbieter zertifizierter Referenzsubstanzen und Laborverbrauchsmaterialien, die ausschließlich für die In-vitro-Forschung entwickelt wurden.\n\n### Analytische Präzision & HPLC-Standards\nJede Charge wird von unabhängigen Laboren mittels HPLC und Massenspektrometrie (LC-MS) auf Reinheitsgrade von über 99,0 % geprüft. Analysenzertifikate (COA) werden chargenspezifisch erstellt und im COA-Tresor bereitgestellt.\n\n### Kühlketten-Logistik\nTemperaturempfindliche Reagenzien werden in Thermobehältern mit Trockeneis oder Kühlakkus transportiert, um die biochemische Integrität zu gewährleisten.\n\n### In-vitro-Compliance\nAlle Materialien sind strikt für die In-vitro-Laborforschung und analytische Kalibrierung vorgesehen. Nicht für die Verabreichung an Mensch oder Tier.`
    },
    'page-quality': {
      title: 'Qualitätssicherung & HPLC-Verifizierung',
      category: 'Wissenschaftlich',
      summary: 'Chargenweise analytische Prüfung, Massenspektrometrie und Reinheitsstandards.',
      content: `## Qualitätssicherung & Prüfprotokolle\n\nBei BK Research Labs ist analytische Integrität das Fundament unserer Arbeit. Wir halten strenge Prüfvorgaben bei jeder Synthese ein.\n\n### Vollständiger Prüfablauf\n1. **Reinheitsbestimmung (HPLC):** Trennt und quantifiziert chemische Fraktionen gegenüber Referenzstandards.\n2. **Molekulare Identitätsbestätigung (LC-MS):** Überprüft die exakte Molmasse ohne Abbauartefakte.\n3. **Sterilitäts- & Endotoxin-Screening:** Lyophilisierte Vials durchlaufen vor Freigabe strenge Keimprüfungen.\n4. **Chargen-Rückverfolgbarkeit per QR-Code:** Scannen Sie den QR-Code auf jeder Ampulle für das verifizierte Analysezertifikat.`
    },
    'page-reconstitution-guide': {
      title: 'Rekonstitutions- & Lagerungsprotokolle',
      category: 'Protokoll',
      summary: 'Laborhandhabung, sterile Verdünnungsschritte und Temperaturparameter.',
      content: `## Labor-Rekonstitution & Handhabungsprotokolle\n\n### Lagerung des lyophilisierten Pulvers\n- **Ungeöffnete Vials:** Trocken bei -20°C lagern (bis zu 24 Monate Haltbarkeit) oder bei 2°C bis 8°C für kurzzeitige Verwendung.\n- Vor UV-Licht und Feuchtigkeit schützen.\n\n### Rekonstitutionsverfahren\n1. Fläschchen vor der Rekonstitution auf Raumtemperatur (20°C - 25°C) erwärmen lassen.\n2. Gummiseptum mit einem sterilen 70% Isopropanol-Tupfer desinfizieren.\n3. Mit einer sterilen Laborspritze bakteriostatisches Wasser langsam an der inneren Glaswand einfließen lassen.\n4. **Nicht schütteln oder vortexen.** Sanft in kreisenden Bewegungen schwenken, bis sich das Pellet vollständig gelöst hat.\n\n### Lagerung rekonstituierter Lösungen\n- Bei 2°C bis 8°C lagern und innerhalb des empfohlenen Versuchszeitraums verwenden (typisch 21–28 Tage).\n- Für längere Lagerung in sterile Kryoröhrchen aliquotieren und bei -80°C einfrieren.`
    },
    'page-compliance-terms': {
      title: 'Lieferbedingungen für Forschungszwecke & Haftungsausschluss',
      category: 'Rechtlich',
      summary: 'Institutionelle Vereinbarungen, In-vitro-Auflagen und behördliche Richtlinien.',
      content: `## Labor-Lieferbedingungen & Compliance-Hinweise\n\n### Nur für Forschungszwecke (RUO)\nAlle von BK Research Labs gelieferten Chemikalien und Referenzstandards sind ausschließlich für **In-vitro-Laborforschung, akademische Studien und Assay-Entwicklungen** bestimmt.\n\n### Verbotene Verwendungszwecke\n- **Nicht für die Verabreichung an Mensch oder Tier:** Unter keinen Umständen dürfen Produkte für klinische, therapeutische oder diagnostische Zwecke verwendet werden.\n- **Käuferqualifikation:** Der Käufer versichert, über adäquate Sicherheitsstandards, PSA und qualifiziertes Fachpersonal zu verfügen.\n\n### Alters- und Identitätsprüfung\nBestellungen sind Personen ab 21 Jahren und autorisierten Institutionen mit nachgewiesenem Forschungszweck vorbehalten.`
    }
  }
};
