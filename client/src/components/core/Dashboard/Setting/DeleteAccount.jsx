import { FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast"; // ✅ add this
import { deleteProfile } from "../../../../services/operations/SettingsAPI";

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState(""); // ✅ added

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
      toast.error("Could not delete account");
    }
  }

  return (
    <div className="my-10 rounded-2xl overflow-hidden border border-pink-500/30 bg-gradient-to-br from-pink-900/40 to-pink-800/20 backdrop-blur-sm">
      <div className="p-8">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-600 to-pink-700 shadow-lg">
            <FiTrash2 className="text-2xl text-pink-100" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-richblack-5 mb-3 flex items-center gap-2">
              Delete Account
              <FiAlertTriangle className="text-yellow-400" />
            </h2>

            <div className="space-y-4 text-pink-100">
              <p className="text-richblack-100">
                Are you sure you want to delete your account? This is a permanent action that cannot be undone.
              </p>

              <div className="bg-pink-900/30 p-4 rounded-lg border border-pink-700/50">
                <h3 className="font-medium text-pink-50 mb-2">What will be deleted:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-pink-200">
                  <li>Your personal information and profile data</li>
                  <li>All course progress and certificates</li>
                  <li>Any purchased courses and associated content</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>
            </div>

            {!isConfirming ? (
              <button
                type="button"
                className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all shadow-lg font-medium flex items-center gap-2"
                onClick={() => setIsConfirming(true)}
              >
                <FiTrash2 className="text-lg" />
                Delete My Account
              </button>
            ) : (
              <div className="mt-6 p-4 bg-richblack-800 rounded-lg border border-pink-500/50">
                <h3 className="text-lg font-semibold text-richblack-5 mb-3">Confirm Deletion</h3>
                <p className="text-richblack-200 mb-4">
                  This action cannot be undone. Please type <span className="font-bold text-pink-200">DELETE MY ACCOUNT</span> to confirm.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Type 'DELETE MY ACCOUNT'"
                    className="flex-1 px-4 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={confirmText} // ✅ bind state
                    onChange={(e) => setConfirmText(e.target.value)} // ✅ update state
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-richblack-600 text-richblack-5 rounded-lg hover:bg-richblack-500 transition-colors"
                      onClick={() => setIsConfirming(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all font-medium flex items-center gap-2"
                      onClick={() => {
                        if (confirmText === "DELETE MY ACCOUNT") {
                          handleDeleteAccount();
                        } else {
                          toast.error("Please type 'DELETE MY ACCOUNT' to confirm");
                        }
                      }}
                    >
                      <FiTrash2 />
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
