import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authService } from '@/services/auth';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (router.isReady && !token) {
      toast.error('Token manquant');
    }
  }, [router.isReady, token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || typeof token !== 'string') {
      toast.error('Token invalide');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit faire au moins 8 caractères');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success('Mot de passe réinitialisé avec succès');
      setTimeout(() => router.push('/admin/login'), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Réinitialiser le mot de passe — DevPortfolio</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient bg-grid p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-glow-primary">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Nouveau mot de passe</h1>
            <p className="text-white/40 text-sm mt-1">Choisissez un nouveau mot de passe sécurisé</p>
          </div>

          {success ? (
            <div className="glass-card p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-success-500/20 flex items-center justify-center mx-auto">
                <ShieldCheck size={24} className="text-success-400" />
              </div>
              <h2 className="text-white font-semibold text-lg">Mot de passe mis à jour !</h2>
              <p className="text-white/50 text-sm">Redirection vers la page de connexion...</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="glass-card p-8 space-y-5">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    aria-label="Afficher/masquer"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    aria-label="Afficher/masquer"
                  >
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full justify-center">
                Réinitialiser
              </Button>

              <p className="text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 hover:underline transition-colors"
                >
                  <ArrowLeft size={14} /> Retour à la connexion
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}
