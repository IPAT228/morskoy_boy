from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamesession',
            name='user',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='game_sessions',
                to=settings.AUTH_USER_MODEL,
                verbose_name='Игрок',
            ),
        ),
        migrations.AddField(
            model_name='gamesession',
            name='question_category',
            field=models.CharField(blank=True, max_length=100, verbose_name='Категория вопросов'),
        ),
    ]
