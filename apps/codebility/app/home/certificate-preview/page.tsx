"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@codevs/ui/button";
import { Card } from "@codevs/ui/card";
import { useUserStore } from "@/store/codev-store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Certificate, { CertificateProps } from "../(dashboard)/_components/DashboardDownloadCertificate";

export const dynamic = "force-dynamic";

export default function CertificatePreview() {
  const router = useRouter();
  const certRef = useRef<HTMLDivElement>(null);
  const { user, userLevel } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>({});
  const [attendancePoints, setAttendancePoints] = useState(0);
  
  // Admin-only state
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserLevel, setSelectedUserLevel] = useState(0);
  
  const isAdmin = user?.role_id === 1;
  
  // Determine initial certificate type based on user role and points
  const getInitialCertType = () => {
    // Based on roadmap: 0-100pts = Intern, 100-200pts = Codev, 200+ = Mentor
    const currentUser = isAdmin && selectedUser ? selectedUser : user;
    const currentLevel = isAdmin && selectedUser ? selectedUserLevel : userLevel;
    
    if (!currentUser) return "intern";
    
    // Check if user has mentor role
    if (currentUser.role_id === 5) return "mentor";
    
    // For Codev role, check level
    if (currentUser.role_id === 10) {
      return currentLevel >= 2 ? "codev" : "intern";
    }
    
    return "intern";
  };
  
  const [certificateType, setCertificateType] = useState<"intern" | "codev" | "mentor">(getInitialCertType());
  const [name, setName] = useState("");
  
  useEffect(() => {
    const currentUser = isAdmin && selectedUser ? selectedUser : user;
    if (currentUser) {
      setName(`${currentUser.first_name} ${currentUser.last_name}`);
      setCertificateType(getInitialCertType());
    }
  }, [user, userLevel, selectedUser, selectedUserLevel, isAdmin]);

  // Load all users for admin selection
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      
      const supabase = await import('@/utils/supabase/client').then(m => m.createClientClientComponent());
      
      try {
        const { data: users } = await supabase
          .from('codev')
          .select('id, first_name, last_name, role_id, level')
          .in('application_status', ['passed'])
          .order('first_name');
          
        setAllUsers(users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, [isAdmin]);
  
  // Fetch user points
  useEffect(() => {
    const fetchPoints = async () => {
      const currentUser = isAdmin && selectedUser ? selectedUser : user;
      if (!currentUser) return;
      
      setLoading(true);
      const supabase = await import('@/utils/supabase/client').then(m => m.createClientClientComponent());
      
      try {
        // Fetch skill points
        const { data: codevPoints } = await supabase
          .from('codev_points')
          .select('points, skill_category_id')
          .eq('codev_id', currentUser.id);
          
        // Fetch attendance points
        const { data: attendanceData } = await supabase
          .from('attendance_summary')
          .select('total_points')
          .eq('codev_id', currentUser.id)
          .single();
          
        const points = codevPoints?.reduce((acc, cp) => {
          acc[cp.skill_category_id] = cp.points;
          return acc;
        }, {} as Record<string, number>) || {};
        
        setSkillPoints(points);
        setAttendancePoints(attendanceData?.total_points || 0);
        
        const totalSkillPoints = Object.values(points).reduce((sum, point) => sum + point, 0);
        setTotalPoints(totalSkillPoints + (attendanceData?.total_points || 0));
      } catch (error) {
        console.error('Error fetching points:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPoints();
  }, [user, selectedUser, isAdmin]);

  // Handle user selection for admin
  const handleUserSelect = (userId: string) => {
    const selected = allUsers.find(u => u.id === userId);
    setSelectedUserId(userId);
    setSelectedUser(selected);
    setSelectedUserLevel(selected?.level || 0);
  };

  const getCertData = (): CertificateProps => {
    switch (certificateType) {
      case "codev":
        return {
          title: "ACHIEVEMENT",
          name: name,
          mainSentence: (
            <p className="text-sm" style={{ wordSpacing: "0.1em" }}>
              has achieved <strong>Codev Status</strong> at{" "}
              <b>Codebility</b>
            </p>
          ),
          description1: (
            <p>
              The recipient has achieved 200 points, demonstrating proficiency in language frameworks,
              completed portfolio projects, and shown commitment to continuous
              learning and development practices.
            </p>
          ),
        };
      case "mentor":
        return {
          title: "LEADERSHIP",
          name: name,
          mainSentence: (
            <p className="text-sm" style={{ wordSpacing: "0.1em" }}>
              has achieved <strong>Mentor Status</strong> at{" "}
              <b>Codebility</b>
            </p>
          ),
          description1: (
            <p>
              The recipient has achieved 300 points, demonstrating specialization,
              advanced concepts mastery, and leadership capabilities. Qualified to
              lead teams, mentor codevs, and earn commissions on project deployments.
            </p>
          ),
        };
      default:
        return {
          title: "GRADUATION",
          name: name,
          mainSentence: (
            <p className="text-sm" style={{ wordSpacing: "0.1em" }}>
              has successfully completed the{" "}
              <strong>Intern Graduate Path</strong> at{" "}
              <b>Codebility</b>
            </p>
          ),
          description1: (
            <p>
              The recipient has mastered the basics, demonstrated hands-on practice,
              and achieved proficiency in version control. This achievement represents
              100 points of dedicated learning and growth.
            </p>
          ),
        };
    }
  };

  const certData = getCertData();

  // Check if user has enough points (admins can bypass this requirement)
  const hasEnoughPoints = isAdmin || totalPoints >= 100;
  const pointsNeeded = Math.max(0, 100 - totalPoints);
  
  // Determine which certificate level user has earned
  const getEarnedCertificate = () => {
    if (totalPoints >= 300) return "mentor";
    if (totalPoints >= 200) return "codev";
    if (totalPoints >= 100) return "intern";
    return null;
  };
  
  const earnedCertificate = getEarnedCertificate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Certificate Preview {isAdmin && selectedUser && `- ${selectedUser.first_name} ${selectedUser.last_name}`}
        </h1>
        <div className="w-20" />
      </div>
      
      {loading ? (
        <Card className="p-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customBlue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your progress...</p>
          </div>
        </Card>
      ) : !hasEnoughPoints ? (
        <Card className="p-12 max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Certificate Locked
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need to earn <span className="font-bold text-customBlue-600">{pointsNeeded} more points</span> to unlock your first certificate.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
                  <span className="text-sm font-bold text-customBlue-600">{totalPoints} / 100 pts</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-customBlue-500 to-customBlue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalPoints / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push('/home')}
              className="bg-customBlue-600 hover:bg-customBlue-700 text-white"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Controls */}
          <Card className="p-6 mb-8 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Certificate Details</h2>
            <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Select User <span className="text-customBlue-600">(Admin)</span>
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-customBlue-500 focus:border-transparent
                             transition-all duration-200"
                  >
                    <option value="">Select a user...</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.first_name} {u.last_name} (Role: {u.role_id === 1 ? 'Admin' : u.role_id === 5 ? 'Mentor' : u.role_id === 10 ? 'Codev' : 'Intern'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-customBlue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Enter recipient name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Certificate Type
                </label>
                <select
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-customBlue-500 focus:border-transparent
                           transition-all duration-200"
                >
                  <option value="intern" disabled={!isAdmin && totalPoints < 100}>Intern (100 pts) {(!isAdmin && totalPoints < 100) ? '🔒' : '✓'}</option>
                  <option value="codev" disabled={!isAdmin && totalPoints < 200}>Codev (200 pts) {(!isAdmin && totalPoints < 200) ? '🔒' : '✓'}</option>
                  <option value="mentor" disabled={!isAdmin && totalPoints < 300}>Mentor (300 pts) {(!isAdmin && totalPoints < 300) ? '🔒' : '✓'}</option>
                </select>
              </div>
            </div>
            
            {earnedCertificate && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  <span className="font-semibold">Congratulations!</span> You have {totalPoints} points and have earned up to the {earnedCertificate} certificate.
                </p>
              </div>
            )}
            
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => {
                  if (certRef.current) {
                    import('html2canvas').then(({ default: html2canvas }) => {
                      html2canvas(certRef.current!, {
                        useCORS: true,
                        scale: 2,
                        backgroundColor: null,
                      }).then(canvas => {
                        const link = document.createElement('a');
                        link.download = `${certData.name}-certificate.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                      });
                    });
                  }
                }}
                className="bg-customBlue-600 hover:bg-customBlue-700 text-white px-8 py-2.5"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Download as PNG
              </Button>
            </div>
          </Card>

          {/* Certificate Preview */}
          <div className="flex justify-center items-center pb-8">
            <div className="overflow-hidden rounded-lg shadow-2xl mx-auto">
              <div className="bg-transparent flex items-center justify-center">
                <div className="transform scale-75 lg:scale-90" style={{ transformOrigin: "center" }}>
                  <Certificate {...certData} ref={certRef} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}