import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { contactService } from '@/services/contact';
import { useProfile } from '@/hooks/usePortfolio';

export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { profile } = useProfile();

  const contactInfo = [
    { icon: Mail,   label: 'Email',       value: profile.contact_email },
    { icon: MapPin, label: 'Localisation', value: profile.location },
    { icon: Phone,  label: 'Téléphone',   value: profile.phone },
  ].filter(item => item.value);

  const onSubmit = async (data) => {
    setSending(true);
    try {
      await contactService.sendMessage(data);
      toast.success('Message envoyé avec succès !');
      reset();
    } catch (e) {
      toast.error(e?.response?.data?.detail || e?.message || 'Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section ref={ref} className="relative py-24 dark:bg-dark-950 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Travaillons ensemble</span>
          <h2 className="section-title">
            Me <span className="gradient-text">contacter</span>
          </h2>
          <p className="dark:text-white/50 text-gray-500 max-w-xl mx-auto mt-4">
            Un projet en tête ? N&apos;hésitez pas à me laisser un message, je vous répondrai sous 24h.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4 }}
                className="glass-card-hover p-5 flex items-center gap-4 group"
              >
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/10 border border-primary-500/25 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Icon size={20} className="text-primary-400 relative z-10" />
                  <div className="absolute inset-0 rounded-xl bg-primary-500/15 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="min-w-0">
                  <div className="dark:text-white/40 text-gray-400 text-xs mb-0.5 uppercase tracking-wider">{label}</div>
                  <div className="dark:text-white text-gray-900 text-sm font-medium truncate">{value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm dark:text-white/60 text-gray-600 mb-1.5">Nom *</label>
                  <input
                    {...register('name', { required: 'Nom requis' })}
                    className="input-field"
                    placeholder="Eddie Franck"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm dark:text-white/60 text-gray-600 mb-1.5">Email *</label>
                  <input
                    {...register('email', {
                      required: 'Email requis',
                      pattern: { value: /^\S+@\S+$/, message: 'Email invalide' },
                    })}
                    type="email"
                    className="input-field"
                    placeholder="eddie@exemple.cmr"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm dark:text-white/60 text-gray-600 mb-1.5">Sujet *</label>
                <input
                  {...register('subject', { required: 'Sujet requis' })}
                  className="input-field"
                  placeholder="Projet de collaboration"
                />
                {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm dark:text-white/60 text-gray-600 mb-1.5">Message *</label>
                <textarea
                  {...register('message', { required: 'Message requis', minLength: { value: 20, message: 'Min. 20 caractères' } })}
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Décrivez votre projet..."
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" loading={sending} icon={<Send size={16} />} className="w-full justify-center">
                Envoyer le message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
