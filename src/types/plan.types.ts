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
  
  export interface Objective {
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
  
  export interface MajorActivity {
    activity_name: string;
  }
  
  export interface PlanPayload {
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
  
    /**
     * =====================================================
     * PLAN META
     * =====================================================
     */
    planName?: string;
  
    yeero?: string;
  
    rawwi?: string;
  
    galma?: string;
  
    /**
     * =====================================================
     * CONTENT SECTIONS
     * =====================================================
     */
    seensa: string;
  
    kaayyoo: string;
  
    galmoota?: string;
  
    xiinxala_raawwii_waggota_darbanii?: string;
  
    toora_xiyyeeffannoo?: string;
  
    tooftaa_raawwii?: string;
  
    rakkowwan?: string;
  
    mulata_ergama_duudhaalee?: string;
  
    xumura?: string;
  
    /**
     * =====================================================
     * MAJOR ACTIVITIES
     * =====================================================
     */
    hojii_gurguddoo?: MajorActivity[];
  
    /**
     * =====================================================
     * HIERARCHICAL PLANNING STRUCTURE
     * =====================================================
     */
    objectives?: Objective[];
  }