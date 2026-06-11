import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, MessageSquare } from 'lucide-react';
import { authService } from '@/services/auth';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Lien envoyé ! Vérifiez votre boîte mail.');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Mot de passe oublié — DevPortfolio</title>
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
              <MessageSquare size={26} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Mot de passe oublié</h1>
            <p className="text-white/40 text-sm mt-1">Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>

          {sent ? (
            <div className="glass-card p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-success-500/20 flex items-center justify-center mx-auto">
                <Mail size={24} className="text-success-400" />
              </div>
              <h2 className="text-white font-semibold text-lg">Email envoyé !</h2>
              <p className="text-white/50 text-sm">
                Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm"
              >
                <ArrowLeft size={16} /> Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="glass-card p-8 space-y-5">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin@devportfolio.fr"
                    required
                  />
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full justify-center">
                Envoyer le lien
              </Button>

              <p className="text-center">
                <Link
                  href="/admin/login"
                  className="text-sm text-primary-400 hover:text-primary-300 hover:underline transition-colors"
                >
                  Retour à la connexion
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}
