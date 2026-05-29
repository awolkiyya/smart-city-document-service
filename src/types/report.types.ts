export interface ReportPayload {
    /**
     * =====================================================
     * BASIC INFORMATION
     * =====================================================
     */
    cityName: string;
  
    sectorName: string;
  
    year: string;
  
    month: string;
  
    subcity?: string;
  
    wereda?: string;

    planName?:string;
  
    /**
     * =====================================================
     * REPORT META
     * =====================================================
     */
    reportName?: string;
    from?:string;
    to?:string;
    target?:string;
    karoora?:string;
    raawwii?:string;
    percenti?:string;

    
    // Day report Data
    dayName?:string;
    dayNumber?:string;


    // Kurmaana Report Data
    kurmaana?:string;
    month1?:string;
    month2?:string;
    month3?:string;

    // Ji'a Report Data
    jia?:string;
  
    /**
     * =====================================================
     * CONTENT SECTIONS
     * =====================================================
     */
    seensa: string;
        
    toora_xiyyeeffannoo?: string;
  
    tooftaa_raawwii?: string;
  
    rakkowwan?: string;
  
    mulata_ergama_duudhaalee?: string;
  
    walitti_qaba?: string;

    ciminoota_turan?: string;

    rakkoolee_quunnaman?: string;

    hanqinoota_mulatan?: string;

    tooftaalee_raawwi?:string;



  
    /**
     * =====================================================
     * MAJOR ACTIVITIES
     * =====================================================
     */

    galmoota?: MainObjective[];
    kaayyolee?: Activity[];

  
    /**
     * =====================================================
     * HIERARCHICAL PLANNING STRUCTURE
     * =====================================================
     */
    objectives?: MainObjective[];
  }


  export interface KPI {
    /**
     * =====================================================
     * KPI IDENTIFICATION
     * =====================================================
     */
    id: string;
  
    indicator: string;
  
    /**
     * =====================================================
     * KPI META
     * =====================================================
     */
    weight: number;
  
    unit: string;
  
    baseline: number;
  
    target: number;
  
    /**
     * =====================================================
     * QUARTERLY EXECUTION
     * =====================================================
     */
    q1: number;
  
    q2: number;
  
    q3: number;
  
    q4: number;
  
    /**
     * =====================================================
     * OPTIONAL COMPUTED VALUES
     * =====================================================
     */
    totalExecution?: number;
  
    achievement?: number;
  }
  
  export interface Activity {
    /**
     * =====================================================
     * ACTIVITY IDENTIFICATION
     * =====================================================
     */
    id: string;
  
    title: string;
  
    /**
     * =====================================================
     * WEIGHT
     * =====================================================
     */
    weight: number;
  
    /**
     * =====================================================
     * KPI LIST
     * =====================================================
     */
    kpis: KPI[];
  }
  
  export interface MainObjective {
    /**
     * =====================================================
     * OBJECTIVE IDENTIFICATION
     * =====================================================
     */
    id: string;
  
    title: string;
  
    /**
     * =====================================================
     * WEIGHT
     * =====================================================
     */
    weight: number;
  
    /**
     * =====================================================
     * ACTIVITIES
     * =====================================================
     */
    activities: Activity[];
  }
  
//   export interface MainObjective {
//     activity_name: string;
//   }